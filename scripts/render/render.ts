/////////////////////////////// cubething.dev /////////////////////////////////

import path from "path";
import { lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import parseMath from "./katex.js";
import { globSync } from "glob";
import { program } from "commander";
import { info, warn, error, sayAndDo } from "scripts/common.js";

type Opts = {
  clean: boolean;
  force: boolean;
  closeOnError: boolean;
};

const acceptedFiletypes = ["tex", "md"];
const configpath = path.join(process.cwd(), "src/static/config/make4ht.cfg");
const outroot = path.join(process.cwd(), "www");
// This assumes the file exists and is of the accepted filetypes.
const render = async (filepath: string, opts: Opts) => {
  const dirname = path.dirname(filepath);
  const filename = path.basename(filepath);
  const relpath = dirname.replace(/.*\/static/, "").replace(/^\//, "");
  const builddir = path.join("build", relpath);
  const outdir = path.join(outroot, relpath);
  const outpath = path.join(outdir, "index.html");
  if (opts.clean) {
    try {
      info("cleaning", builddir);
      rmSync(builddir, { recursive: true, force: true });
    } catch (e) {
      warn(e);
    }
    try {
      info("cleaning", outpath);
      rmSync(outpath);
    } catch (e) {
      warn(e);
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
  // const md = path.extname(filename) === ".md";
  // let intermediatePath = filepath;
  // if (md) {
  //   intermediatePath = path.join(builddir, filename.replace("md", "tex"));
  //   const cmd = `pandoc -s -f gfm -o '${intermediatePath}' -t latex ${filepath}`;
  //   console.info(filepath, "->", intermediatePath);
  //   const out = spawnSync("sh", ["-c", cmd]);
  //   if (out.error) {
  //     console.error(out.error);
  //     throw { type: "error" };
  //   }
  // }
  const preprocess =
    path.extname(filename) !== ".tex" ? "+preprocess_input" : "";
  // search for local packages and include the defaults
  const cmd = `
        TEXINPUTS=.:src/static//:
        make4ht
        -x
        -j index
        -f html5+latexmk_build${preprocess}
        -B ${builddir}
        --config ${configpath}
        ${filepath}
        "fn-in,mathjax,-css";
        mkdir -p ${outdir};
        cp ${builddir}/index.html ${outdir}
      `.replaceAll(/\n|\s/g, " ");
  const out = await sayAndDo(cmd, { stdio: "pipe" });
  if (out.error) {
    error(out.stdout.toString(), out.stderr.toString());
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
    writeFileSync(
      filepath.replace(filename, ".published"),
      new Date().toISOString(),
    );
    return out;
  } catch (e) {
    error(e);
    throw {
      type: "error",
      command: e,
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
};
export default render;

export const renderAll = async (opts: Opts) => {
  const failedFiles = [];
  const renderedFiles = [];
  const cachedFiles = [];
  for (const file of globSync(
    path.join(
      process.cwd(),
      `src/static/**/main.{${acceptedFiletypes.join(",")}}`,
    ),
  )) {
    const friendlyName = path.basename(path.dirname(file));
    try {
      const res = await render(file, opts);
      if (res === true) {
        cachedFiles.push(friendlyName);
      } else {
        renderedFiles.push(friendlyName);
      }
    } catch (error) {
      const relpath = path.dirname(file).replace(/.*\/static/, "");
      const builddir = path.join("build", relpath);
      failedFiles.push(friendlyName);
      writeFileSync(
        path.join(builddir, "error.json"),
        JSON.stringify(error, null, 2),
      );
      if (opts.closeOnError) {
        return process.exit(1);
      }
    }
  }
  info({ failedFiles, renderedFiles, cachedFiles });
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
        error(`No such file or directory "${inputFile}"`);
        process.exit(1);
      } else if (lstat?.isDirectory()) {
        error("Please specifiy a file, not a directory.");
        process.exit(1);
      }

      const res = await render(inputFile, { clean, force, closeOnError });

      if (res === true) {
        info(`No changes in ${inputFile}`);
      } else {
        info(`(Re)rendered ${inputFile}`);
      }
      process.exit(0);
    } catch (e) {
      error("Failed to render", inputFile, e);
      process.exit(1);
    }
  } else {
    renderAll({ clean, force, closeOnError });
  }
}
