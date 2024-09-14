/////////////////////////////// cubething.dev /////////////////////////////////

import path from "path";
import {
  lstatSync,
  mkdirSync,
  readFileSync,
  rm,
  rmdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import { spawnSync } from "child_process";
import parseMath from "./katex.js";
import { globSync } from "glob";
import { program } from "commander";

const acceptedFiletypes = ["tex", "md"];
const configpath = path.join(process.cwd(), "src/markup/MyConfig.cfg");
const outroot = path.join(process.cwd(), "www");
// This assumes the file exists and is of the accepted filetypes.
const render = (filepath: string, opts: { clean: boolean }) => {
  const dirname = path.dirname(filepath);
  const relpath = dirname.replace(/.*\/markup/, "");
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
  try {
    mkdirSync(builddir, { recursive: true });
  } catch {
    /* empty */
  }
  const tex = path.extname(filepath) === ".tex";
  const mdflags = tex ? "" : "+preprocess_input";
  const cmd = `
        make4ht
        -x
        -j index
        -d ${outdir}
        -f html5+latexmk_build${mdflags}
        --config ${configpath}
        ${filepath}
        "fn-in,TocLink,-css,mathjax"
      `;
  const out = spawnSync("sh", ["-c", cmd.replaceAll("\n", "")], {
    cwd: builddir,
  });
  try {
    const file = readFileSync(outpath).toString();
    const out = parseMath(file);
    writeFileSync(outpath, out);
    return out;
  } catch (error) {
    throw {
      type: "error",
      command: error,
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
};
export default render;

export const renderAll = (opts: { clean: boolean }) => {
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
      failedFiles.push({ file, error });
      writeFileSync(
        path.join(builddir, "error.json"),
        JSON.stringify(error, null, 2),
      );
    }
  }
  console.log({ failedFiles, renderedFiles, cachedFiles });
};

if (import.meta.main) {
  program.argument("[string]").option("--clean").parse();
  const inputFile = program.args[0];
  const clean = program.opts()["clean"];
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

      const res = render(inputFile, { clean });

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
    renderAll({ clean });
  }
}
