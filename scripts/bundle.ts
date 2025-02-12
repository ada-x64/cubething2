/////////////////////////////// cubething.dev /////////////////////////////////

import { readFileSync } from "fs";
import { globbySync } from "globby";
import { program } from "commander";
import path from "path";
import type { BuildConfig } from "bun";
import { error, info } from "./common";

export type Opts = {
  exitOnFail: boolean;
  quiet: boolean;
  verbose: boolean;
  dryRun: boolean;
};
export const defaultOpts: Opts = {
  exitOnFail: true,
  quiet: false,
  verbose: false,
  dryRun: false,
};

export type AppConfig = {
  build: BuildConfig;
  public: boolean;
  root: string;
};
export const defaultBuildConfig: BuildConfig = {
  entrypoints: ["index.ts"],
  minify: true,
  sourcemap: "inline",
};
export const defaultAppConfig: AppConfig = {
  build: defaultBuildConfig,
  public: true,
  root: "/",
};
function isAppConfig(obj: object): obj is AppConfig {
  const keysMatch = Object.keys(defaultAppConfig).reduce(
    (res, key) => res && Object.keys(obj).includes(key),
    true,
  );
  if (!keysMatch) {
    console.log(obj, defaultAppConfig);
    return false;
  }
  const newConfig = obj as AppConfig;
  const buildKeys = Object.keys(newConfig.build);
  return buildKeys.reduce((prev, current) => {
    console.log(prev, current);
    return prev && buildKeys.includes(current);
  }, true);
}
export function main(opts: Opts = defaultOpts) {
  globbySync("src/apps/*/buildcfg.json").forEach(async (cfgpath) => {
    try {
      info("Building", cfgpath);
      const value = readFileSync(cfgpath).toString();
      const cfg = JSON.parse(value);
      if (!isAppConfig(cfg)) {
        error("Invalid app config at ", cfgpath);
        return;
      }
      cfg.build.entrypoints = cfg.build.entrypoints.map((ep) =>
        path.resolve(cfgpath + "/../" + ep),
      );
      cfg.build.outdir =
        cfg.build.outdir ??
        "www/js/" + path.basename(cfgpath.replace("/buildcfg.json", ""));
      info("Build opts:", cfg);
      if (!opts.dryRun) {
        const output = await Bun.build(cfg.build);
        if (opts.verbose) {
          info(output);
        }
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
  const optEntries = Object.entries(program.opts()).map(([k, v]) => {
    return [k, v === "true" || v === true];
  });
  const opts = Object.fromEntries(optEntries) as Opts;
  if (opts.verbose) {
    process.env["LOG_LEVEL"] = "info";
  } else if (opts.quiet) {
    process.env["LOG_LEVEL"] = "error";
  }
  main(opts);
}
