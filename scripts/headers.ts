/////////////////////////////// cubething.dev /////////////////////////////////

import fs from "fs";
import { globbySync } from "globby";

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
  ".css": ["*", "/*", "*/"],
  ".tex": ["%"],
  ".html": ["-", "<!--", "-->"],
  ".md": ["-", "<!--", "-->"],
};
const check = (write: boolean) => {
  let failed = false;
  for (const [ext, [c, prefix, postfix]] of Object.entries(filetypes)) {
    globbySync(`./**/*${ext}`, {
      onlyFiles: true,
      ignoreFiles: ["**/.gitignore", "**/.prettierignore"],
      ignore: ["README.md", "www/**/*/out", "www/**/*/index.*"],
      globstar: true,
    }).forEach((filename) => {
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
    });
  }
  if (!failed) {
    console.log("No missing headers!");
    return true;
  } else if (!write && failed) {
    console.log("Run with --write to fix.");
    return false;
  }
};

if (import.meta.filename === Bun.main) {
  const write = process.argv.includes("--write");
  const ok = check(write);
  process.exit(Number(!ok));
}

export default check;
