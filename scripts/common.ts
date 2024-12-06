import {
  spawnSync,
  type SpawnSyncOptionsWithBufferEncoding,
} from "child_process";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (kind: "info" | "warn" | "error", ...args: any) => {
  const color =
    kind === "info" ? "\x1b[34m" : kind === "warn" ? "\x1b[93m" : "\x1b[91m";
  console.log(
    ...[`${color}\udb85\ude16 [${kind.toUpperCase()}]\x1b[0m`, ...args],
  );
};
export const info = (...args: unknown[]) => log("info", args);
export const error = (...args: unknown[]) => log("error", args);
export const warn = (...args: unknown[]) => log("warn", args);

export const sayAndDo = async (
  script: string,
  opts: SpawnSyncOptionsWithBufferEncoding = {
    cwd: process.cwd(),
    stdio: "inherit",
  },
) => {
  info("> " + script);
  return spawnSync("sh", ["-c", script], opts);
};
