/////////////////////////////// cubething.dev /////////////////////////////////

import path from "path";
import { lstatSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import parseMath from "./katex.js";
import { globSync } from "glob";
import { program } from "commander";
import { info, warn, error, sayAndDo, debug } from "scripts/common.js";

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
      await sayAndDo(`rm -rf ${builddir}`);
    } catch (e) {
      warn(e);
    }
    try {
      await sayAndDo(`rm -rf ${outdir}`);
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
  let out;
  let intermediateFile = filepath;

  const preprocess = path.extname(filename) !== ".tex";
  if (preprocess) {
    // this intermediary is (almost) equivalent to
    // the make4ht preprocess_input extension
    const cmd = `pandoc -s -f markdown+raw_attribute -o '${builddir}/main.tex' -t latex ${filepath}`;
    out = await sayAndDo(cmd);
    intermediateFile = path.join(builddir, "main.tex");
    if (out.error) {
      error(out.stdout.toString(), out.stderr.toString());
      throw {
        type: "error",
        stdout: out.stdout.toString(),
        stderr: out.stderr.toString(),
      };
    }
  }

  const cmd = `
        TEXINPUTS=.:src/static//:
        make4ht
        -x
        -j index
        -f html5+latexmk_build
        -B ${builddir}
        --config ${configpath}
        ${intermediateFile}
        "fn-in,mathjax,-css"
      `
    .replaceAll(/ {2}/g, "")
    .replaceAll(/\n/g, " ");
  out = await sayAndDo(cmd, { stdio: "pipe" });
  if (out.error) {
    error(out.stdout.toString(), out.stderr.toString());
    throw {
      type: "error",
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
  out = await sayAndDo(
    `mkdir -p ${outdir}; cp ${builddir}/index.html ${outpath}`,
  );
  if (out.error) {
    error(out.stdout.toString(), out.stderr.toString());
    throw {
      type: "error",
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
  try {
    const file = readFileSync(outpath).toString();
    const out = parseMath(file);
    writeFileSync(outpath, out);
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
  if (failedFiles.length) {
    warn({ failedFiles });
  }
  if (renderedFiles.length) {
    info({ renderedFiles });
  }
  if (cachedFiles.length) {
    debug({ cachedFiles });
  }
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
