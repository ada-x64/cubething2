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
  lastRender: Date;
  contentType: string;
  frontmatter?: { [x: string]: string };

  constructor(
    url: string,
    lastRender: Date,
    contentType: string,
    frontmatter?: { [x: string]: string },
  ) {
    this.url = url;
    this.lastRender = lastRender;
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
  URL_BASE: string,
  DRY_RUN: boolean = false,
  DECODER: TextDecoder = new TextDecoder(),
) {
  for (const thepath of globSync(path.join(basePath, "*"))) {
    const filename = path.basename(thepath);
    const relpath = path.dirname(thepath).replace(/.*\/static/, "");
    const builddir = path.join("build", relpath);
    const stat = fs.statSync(thepath);
    if (stat.isFile()) {
      if (thepath.includes("meta.json")) {
        continue;
      }

      const lastRender = new Date();
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
        lastRender,
        contentType,
      };
      if (
        contentType.startsWith("image") &&
        ![".svg", ".ico"].includes(extension)
      ) {
        // automatically make smaller webp preview if it doesn't exist
        const webpPath = thepath.replace(extension, ".webp");
        const webpFilename = path.basename(webpPath);
        try {
          fs.statSync(webpPath);
        } catch {
          if (!DRY_RUN) {
            const resize = filename.startsWith("preview")
              ? "-resie 256x192"
              : "";
            const cmd = `convert ${thepath} ${resize} ${webpPath}`;
            console.log({ cmd, cwd: builddir });
            spawnSync("sh", ["-c", cmd.replaceAll("\n", "")], {});
          }
          map[webpFilename] = {
            url: path.join(URL_BASE, webpPath.replace(/.*\/static\//, "")),
            lastRender,
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
      await generateMeta(thepath, submap, URL_BASE, DRY_RUN, DECODER);
      map[filename] = submap;
    }
  }
}

if (import.meta.main) {
  const CDN_PATH = "src/static";
  const URL_BASE = "/static/";
  const DRY_RUN = argv.includes("--dry-run");

  // load old metadata
  const map = {};
  await generateMeta(CDN_PATH, map, URL_BASE, DRY_RUN);
  if (DRY_RUN) {
    console.log(JSON.stringify(map));
  } else {
    try {
      fs.mkdirSync("www");
    } catch {
      //
    }
    fs.writeFileSync("www/meta.json", JSON.stringify(map));
  }
}
