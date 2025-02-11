import { readFileSync } from "fs";
import { globbySync } from "globby";
import type { BuildConfig } from "bun";
import { error, info } from "console";
import { program } from "commander";
import path from "path";

export type Opts = {
  exitOnFail: boolean;
  quiet: boolean;
  verbose: boolean;
};
export const defaultOpts: Opts = {
  exitOnFail: true,
  quiet: false,
  verbose: false,
};
export function main(opts: Opts = defaultOpts) {
  globbySync("src/apps/*/buildcfg.json").forEach(async (cfgpath) => {
    try {
      if (opts.verbose || !opts.quiet) {
        info("Building", cfgpath);
      }
      const value = readFileSync(cfgpath).toString();
      const cfg = JSON.parse(value) as BuildConfig;
      cfg.entrypoints = cfg.entrypoints.map((ep) =>
        path.resolve(cfgpath + "/../" + ep),
      );
      if (opts.verbose) {
        info("Build opts:", cfg);
      }
      const output = await Bun.build(cfg);
      if (opts.verbose) {
        console.info(output);
      }
    } catch (e) {
      error(e);
      if (opts.exitOnFail) {
        process.exit(1);
      }
    }
  });
}

if (import.meta.main) {
  const commander = await import("commander");
  Object.entries(defaultOpts).forEach(([k, v]) => {
    commander.program.option(`-${k[0]}, --${k}`, undefined, `${v}`);
  });
  commander.program.parse();
  const opts = Object.entries(program.opts()).map(([k, v]) => {
    return [k, v === "true" || v === true];
  });
  main(Object.fromEntries(opts));
}
