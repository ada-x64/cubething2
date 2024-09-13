/////////////////////////////// cubething.dev /////////////////////////////////

const TEX_ROOT = process.env["TEX_ROOT"] ?? "";
import path from "path";
import { lstat, lstatSync, readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";
import parseMath from "./katex.js";
import { globSync } from "glob";
import { program } from "commander";

const acceptedFiletypes = ["tex", "md"];
const render = (
  filepath: string,
  outroot: string,
  configpath: string,
  log?: typeof console,
) => {
  const dirname = path.dirname(filepath);
  const outdir = path.join(outroot, path.basename(path.dirname(filepath)));
  const outpath = path.join(outdir, "index.html");
  // check the file exists
  lstatSync(filepath);
  // if there is a cached html file, prefer the html file
  try {
    const debounce = 10;
    const mainLstat = lstatSync(filepath);
    const lastEdit = Math.floor(mainLstat.ctimeMs / (1000 * debounce));
    const lastRender = Math.floor(
      lstatSync(outpath).ctimeMs / (1000 * debounce),
    );
    if (lastEdit <= lastRender) {
      log?.info("Serving cached file " + outpath);
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
  } catch {
    // rerender it
  }
  log?.info("(Re)rendering" + filepath);
  const tex = path.extname(filepath) === ".tex";
  const out = spawnSync(
    "sh",
    [
      "-c",
      `
            ${path.join(TEX_ROOT, "make4ht")} \
            -x \
              -j index\
              -d ${outdir}\
              -f html5+latexmk_build${tex ? "" : "+preprocess_input"} \
              ${filepath} \
              "fn-in,TocLink,-css,no-DOCTYPE,mathjax" \
              --config ${configpath};

           # ${path.join(TEX_ROOT, "make4ht")}\
              -j index \
              -m clean \
              ${dirname}
          `,
    ],
    { cwd: dirname },
  );
  if (out.stdout) {
    log?.debug({ stdout: out.stdout.toString() });
  }
  if (out.stderr) {
    log?.warn({ stderr: out.stderr.toString() });
  }
  if (out.error) {
    log?.error({ error: out.error });
  }
  try {
    const out = parseMath(outpath);
    writeFileSync(outpath, out);
    return out;
    // return sendArticle(req, reply, out);
  } catch (error) {
    throw {
      type: "error",
      error,
      stdout: out.stdout.toString(),
      stderr: out.stderr.toString(),
    };
  }
};
export default render;

if (import.meta.main) {
  const src = path.join(process.cwd(), "src/articles");
  const out = path.join(process.cwd(), "www/articles");
  program.option("-v").argument("[string]").parse();
  const log = program.opts()["v"] ? console : undefined;
  const inputFile = program.args[0];
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
      const res = render(inputFile, out, path.join(src, "MyConfig.cfg"), log);
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
  }

  const failedFiles = [];
  const renderedFiles = [];
  const cachedFiles = [];
  for (const file of globSync(
    path.join(
      process.cwd(),
      `src/articles/**/main.{${acceptedFiletypes.join(",")}}`,
    ),
  )) {
    try {
      const res = render(file, out, path.join(src, "MyConfig.cfg"), log);
      if (res === true) {
        cachedFiles.push(file);
      } else {
        renderedFiles.push(file);
      }
    } catch (error) {
      failedFiles.push({ file, error });
      writeFileSync(
        path.join(path.dirname(file), "error.json"),
        JSON.stringify(error),
      );
    }
  }
  console.log({ failedFiles, renderedFiles, cachedFiles });
}
