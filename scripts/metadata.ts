/////////////////////////////// cubething.dev /////////////////////////////////

import * as fs from "fs";
import * as path from "path";
import mime from "mime";
import { spawnSync } from "child_process";
import { argv } from "process";
import * as yaml from "yaml";
import { globSync } from "glob";

export class Metadata {
  url: string;
  lastCommitDate: Date;
  contentType: string;
  frontmatter?: { [x: string]: string };

  constructor(
    url: string,
    lastCommitDate: Date,
    contentType: string,
    frontmatter?: { [x: string]: string },
  ) {
    this.url = url;
    this.lastCommitDate = lastCommitDate;
    this.contentType = contentType;
    this.frontmatter = frontmatter;
  }
}

export type MetadataMap = {
  [x: string]: Metadata | MetadataMap;
};

export default async function generateMeta(
  basePath: string,
  map: MetadataMap,
  DECODER: TextDecoder,
  CHANGED_FILES: string[],
  URL_BASE: string,
  DRY_RUN: boolean,
) {
  for (const thepath of globSync(path.join(basePath, "*"))) {
    const filename = path.basename(thepath);
    const relpath = path.dirname(thepath).replace(/.*\/markup/, "");
    const builddir = path.join("build", relpath);
    const stat = fs.statSync(thepath);
    if (stat.isFile()) {
      if (thepath.includes("meta.json")) {
        continue;
      }

      const lastCommitDate = await getLastCommitDate(
        thepath,
        DECODER,
        CHANGED_FILES,
      );
      const extension = path.extname(thepath);
      const contentType = mime.getType(thepath);
      if (!contentType) {
        console.warn(
          `Unable to generate contentType for extension ${extension}`,
        );
        continue;
      }
      const metadata: Metadata = {
        url: relpath,
        lastCommitDate,
        contentType,
      };
      if (contentType.startsWith("image")) {
        // automatically make smaller webp preview if it doesn't exist
        const webpPath = thepath.replace(extension, ".webp");
        const webpFilename = path.basename(webpPath);
        try {
          fs.statSync(webpPath);
        } catch {
          if (!DRY_RUN) {
            const cmd = `convert ${thepath} -resize 256x192 ${webpPath}`;
            spawnSync("sh", ["-c", cmd.replaceAll("\n", "")], {
              cwd: builddir,
            });
          }
          map[webpFilename] = {
            url: path.join(URL_BASE, webpPath.replace(/.*\/markup\//, "")),
            lastCommitDate,
            contentType: "image/webp",
          };
        }
      }
      if (contentType === "text/markdown") {
        let content = fs.readFileSync(thepath).toString();
        content = content.replace(/<!-.*->/, "");
        const maybeFrontmatter = content.split("---").at(1);
        if (maybeFrontmatter) {
          metadata.frontmatter = yaml.parse(maybeFrontmatter);
        }
      }
      if (contentType === "application/x-tex") {
        const content = fs.readFileSync(thepath).toString();
        const maybeFrontmatter = content.split(/%\s---/).at(1);
        if (maybeFrontmatter) {
          const frontmatter = maybeFrontmatter.replaceAll(/%\s+/g, "");
          metadata.frontmatter = yaml.parse(frontmatter);
        }
      }
      map[filename] = metadata;
    } else {
      const submap: MetadataMap = {};
      await generateMeta(
        thepath,
        submap,
        DECODER,
        CHANGED_FILES,
        URL_BASE,
        DRY_RUN,
      );
      map[filename] = submap;
    }
  }
}

async function getLastCommitDate(
  file: string,
  DECODER: TextDecoder,
  CHANGED_FILES: string[],
) {
  if (CHANGED_FILES.includes(file)) {
    return new Date();
  } else {
    const cmd = `git --no-pager log --pretty=%aD -n 1 -- ${file}`;
    const output = spawnSync("sh", ["-c", cmd.replaceAll("\n", "")]);
    const stderr = DECODER.decode(output.stderr);
    const stdout = DECODER.decode(output.stdout);
    if (stderr) {
      throw new Error(stderr);
    }
    return new Date(stdout);
  }
}

if (import.meta.main) {
  const CDN_PATH = "src/markup";
  const URL_BASE = "/static/";

  const DRY_RUN = argv.includes("--dry-run");

  const DECODER = new TextDecoder();
  // Gets any cdn files that have been changed on HEAD.
  // This way you can use this as a pre-commit hook.
  // Always returns paths from git root.
  const CHANGED_FILES = DECODER.decode(
    spawnSync("sh", ["-c", `git --no-pager diff --name-only HEAD`]).stdout,
  )
    .split("\n")
    .filter((s) => s.includes("src"));

  const map = {};
  await generateMeta(CDN_PATH, map, DECODER, CHANGED_FILES, URL_BASE, DRY_RUN);
  if (DRY_RUN) {
    console.log(JSON.stringify(map));
  } else {
    fs.writeFileSync("www/articles/meta.json", JSON.stringify(map));
  }
}
