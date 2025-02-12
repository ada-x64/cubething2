/////////////////////////////// cubething.dev /////////////////////////////////

import {
  spawnSync,
  type SpawnSyncOptionsWithBufferEncoding,
} from "child_process";

enum LogLevel {
  "error" = 0,
  "warn" = 1,
  "info" = 2,
}
const colors = {
  0: "\x1b[91m",
  1: "\x1b[93m",
  2: "\x1b[34m",
};
const labels = {
  0: "ERROR",
  1: "WARN",
  2: "INFO",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const log = (kind: LogLevel, args: any) => {
  if (Number(process.env["LOG_LEVEL"] ?? 2) < kind) {
    return;
  }
  console.log(`${colors[kind]}\udb85\ude16 [${labels[kind]}]\x1b[0m`, ...args);
};
export const info = (...args: unknown[]) => log(LogLevel.info, args);
export const error = (...args: unknown[]) => log(LogLevel.error, args);
export const warn = (...args: unknown[]) => log(LogLevel.warn, args);

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
