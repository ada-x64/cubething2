/////////////////////////////// cubething.dev /////////////////////////////////

import path from "path";
import { lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";
import parseMath from "./katex.js";
import { globSync } from "glob";
import { program } from "commander";

type Opts = {
  clean: boolean;
  force: boolean;
  closeOnError: boolean;
};

const acceptedFiletypes = ["tex", "md"];
const configpath = path.join(process.cwd(), "src/markup/make4ht.cfg");
const outroot = path.join(process.cwd(), "www");
// This assumes the file exists and is of the accepted filetypes.
const render = (filepath: string, opts: Opts) => {
  const dirname = path.dirname(filepath);
  const filename = path.basename(filepath);
  const relpath = dirname.replace(/.*\/markup/, "").replace(/^\//, "");
  const builddir = path.join("build", relpath);
  const outdir = path.join(outroot, relpath);
  const outpath = path.join(outdir, "index.html");
  if (opts.clean) {
    try {
      console.log("cleaning", builddir);
      rmSync(builddir, { recursive: true, force: true });
    } catch (e) {
      console.warn(e);
    }
    try {
      console.log("cleaning", outpath);
      rmSync(outpath);
    } catch (e) {
      console.warn(e);
    }
  }
  // if there is a cached html file, prefer the html file
  if (!opts.force) {
    try {
      const debounce = 10;
      const mainLstat = lstatSync(filepath);
      const lastEdit = Math.floor(mainLstat.ctimeMs / (1000 * debounce));
      const lastRender = Math.floor(
        lstatSync(outpath).ctimeMs / (1000 * debounce),
      );
      if (lastEdit <= lastRender) {
        try {
          if (import.meta.main) {
            return true;
          } else {
            return readFileSync(outpath).toString();
          }
        } catch (error) {
          throw { type: "error", error };
        }
      }
    } catch (error) {
      if ((error as { type: string })?.type === "error") {
        throw error;
      }
    }
  }
  try {
    mkdirSync(builddir, { recursive: true });
  } catch {
    /* empty */
  }
  // NOTE: this intermediary is equivalent to a customizable version of the make4ht preprocess_input extension
  const md = path.extname(filename) === ".md";
  let intermediatePath = filepath;
  if (md) {
    intermediatePath = path.join(builddir, filename.replace("md", "tex"));
    const cmd = `pandoc -s -f gfm -o '${intermediatePath}' -t latex ${filepath}`;
    console.info(filepath, "->", intermediatePath);
    const out = spawnSync("sh", ["-c", cmd]);
    if (out.error) {
      console.error(out.error);
      throw { type: "error" };
    }
  }
  const cmd = `
        make4ht
        -x
        -j index
        -d ${outdir}
        -f html5+latexmk_build
        --config ${configpath}
        ${path.resolve(intermediatePath)}
        "fn-in,mathjax,-css"
      `;
  console.info(intermediatePath, "->", outdir + "/index.html");
  const out = spawnSync("sh", ["-c", cmd.replaceAll("\n", "")], {
    cwd: builddir,
  });
  if (out.error) {
    console.error(out.stdout.toString(), out.stderr.toString());
    throw {
      type: "error",
      command: cmd,
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
  try {
    const file = readFileSync(outpath).toString();
    const out = parseMath(file);
    writeFileSync(outpath, out);
    return out;
  } catch (error) {
    console.error(error);
    throw {
      type: "error",
      command: error,
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
};
export default render;

export const renderAll = (opts: Opts) => {
  const failedFiles = [];
  const renderedFiles = [];
  const cachedFiles = [];
  for (const file of globSync(
    path.join(
      process.cwd(),
      `src/markup/**/main.{${acceptedFiletypes.join(",")}}`,
    ),
  )) {
    try {
      const res = render(file, opts);
      if (res === true) {
        cachedFiles.push(file);
      } else {
        renderedFiles.push(file);
      }
    } catch (error) {
      const relpath = path.dirname(file).replace(/.*\/markup/, "");
      const builddir = path.join("build", relpath);
      failedFiles.push(file);
      writeFileSync(
        path.join(builddir, "error.json"),
        JSON.stringify(error, null, 2),
      );
      if (opts.closeOnError) {
        return process.exit(1);
      }
    }
  }
  console.log({ failedFiles, renderedFiles, cachedFiles });
};

if (import.meta.main) {
  program
    .argument("[string]")
    .option("--clean")
    .option("--force")
    .option("--close-on-error")
    .parse();
  const inputFile = program.args[0];
  const clean = program.opts()["clean"];
  const force = program.opts()["force"];
  const closeOnError = program.opts()["closeOnError"];
  if (inputFile) {
    try {
      const lstat = lstatSync(inputFile, { throwIfNoEntry: false });
      if (!lstat) {
        console.error(`No such file or directory "${inputFile}"`);
        process.exit(1);
      } else if (lstat?.isDirectory()) {
        console.error("Please specifiy a file, not a directory.");
        process.exit(1);
      }

      const res = render(inputFile, { clean, force, closeOnError });

      if (res === true) {
        console.log(`No changes in ${inputFile}`);
      } else {
        console.log(`(Re)rendered ${inputFile}`);
      }
      process.exit(0);
    } catch (e) {
      console.error("Failed to render", inputFile, e);
      process.exit(1);
    }
  } else {
    renderAll({ clean, force, closeOnError });
  }
}
