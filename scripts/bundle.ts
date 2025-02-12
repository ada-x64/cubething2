/////////////////////////////// cubething.dev /////////////////////////////////

import { readFileSync, writeFileSync } from "fs";
import { globbySync } from "globby";
import { program } from "commander";
import path from "path";
import type { BuildConfig } from "bun";
import { debug, error, info } from "./common";

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
  title: string;
};
export const defaultBuildConfig: BuildConfig = {
  entrypoints: ["index.ts"],
  minify: true,
  sourcemap: "inline",
  env: "inline",
};
export const defaultAppConfig: AppConfig = {
  build: defaultBuildConfig,
  public: true,
  root: "/",
  title: "app",
};
function isAppConfig(obj: object): obj is AppConfig {
  const keysMatch = Object.keys(defaultAppConfig).reduce(
    (res, key) => res && Object.keys(obj).includes(key),
    true,
  );
  if (!keysMatch) {
    return false;
  }
  const newConfig = obj as AppConfig;
  const buildKeys = Object.keys(newConfig.build);
  return buildKeys.reduce((prev, current) => {
    return prev && buildKeys.includes(current);
  }, true);
}
export default async function main(opts: Opts = defaultOpts) {
  const metadata: AppConfig[] = [];
  for (const cfgpath of globbySync("src/apps/*/buildcfg.json")) {
    try {
      info("Building", cfgpath.replace("/buildcfg.json", ""));
      const value = readFileSync(cfgpath).toString();
      const cfg = JSON.parse(value);
      if (!isAppConfig(cfg)) {
        error("Invalid app config at ", cfgpath);
        return;
      }
      const outdir =
        "www/js/" + path.basename(cfgpath.replace("/buildcfg.json", ""));
      const dfault = {
        ...defaultBuildConfig,
        outdir,
      };
      cfg.build = { ...dfault, ...cfg.build };
      cfg.build.entrypoints = cfg.build.entrypoints.map((ep) =>
        path.resolve(cfgpath + "/../" + ep),
      );
      debug("Build opts:", cfg);
      if (opts.dryRun) return;
      const output = await Bun.build({ ...defaultBuildConfig, ...cfg.build });
      debug(output);
      metadata.push(cfg);
    } catch (e) {
      error(e);
      if (opts.exitOnFail) {
        process.exit(1);
      }
    }
  }
  writeFileSync("www/js/meta.json", JSON.stringify(metadata));
  debug("Wrote metadata to www/js/meta.json", metadata);
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
    process.env["LOG_LEVEL"] = "trace";
  } else if (opts.quiet) {
    process.env["LOG_LEVEL"] = "error";
  }
  await main(opts);
}
