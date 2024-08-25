/////////////////////////////// cubething.dev /////////////////////////////////

import fs from "fs";
import { globSync } from "glob";

const IGNORE_PATHS = fs
  .readFileSync(".gitignore")
  .toString()
  .split("\n")
  .map((x) => x + (x.endsWith("/") ? "**" : ""))
  .concat(["README.md"]);

// 1. apply header
const header = (c: string, prefix?: string, postfix?: string) =>
  (prefix ?? "") +
  c.repeat(31 - (prefix?.length ?? 0)) +
  " cubething.dev " +
  c.repeat(33 - (postfix?.length ?? 0)) +
  (postfix ?? "") +
  "\n\n";

const filetypes = {
  ".ts": ["/"],
  ".js": ["/"],
  ".css": ["#"],
  ".tex": ["#"],
  ".html": ["-", "<!--", "-->"],
  ".md": ["-", "<!--", "-->"],
};
const check = (write: boolean) => {
  let failed = false;
  for (const [ext, [c, prefix, postfix]] of Object.entries(filetypes)) {
    globSync(`./**/*${ext}`, { nodir: true, ignore: IGNORE_PATHS }).forEach(
      (filename) => {
        let content = fs.readFileSync(filename).toString();
        const theheader = header(c, prefix, postfix);
        if (!content.startsWith(theheader)) {
          failed = true;
          if (write) {
            content = theheader + content;
            fs.writeFile(filename, content, () => {
              console.log(`Added missing header to ${filename}`);
            });
          } else {
            console.warn(`Missing header in ${filename}`);
          }
        }
      },
    );
  }
  if (!failed) {
    console.log("No missing headers!");
  } else if (!write && failed) {
    console.log("Run with --write to fix.");
  }
};

if (import.meta.filename === Bun.main) {
  const write = process.argv.includes("--write");
  check(write);
}

export default check;
