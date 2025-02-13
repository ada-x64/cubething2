/////////////////////////////// cubething.dev /////////////////////////////////

import {
  spawnSync,
  type SpawnSyncOptionsWithBufferEncoding,
} from "child_process";

export enum LogLevel {
  "error" = 0,
  "warn" = 1,
  "info" = 2,
  "debug" = 3,
  "trace" = 4,
}
const colors = {
  0: "\x1b[91m",
  1: "\x1b[93m",
  2: "\x1b[34m",
  3: "\x1b[46m",
  4: "\x1b[47m",
};
const labels = {
  0: "ERROR",
  1: "WARN",
  2: "INFO",
  3: "DEBUG",
  4: "TRACE",
};

export const DEFAULT_LOG_LEVEL = LogLevel.info;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const log = (level: LogLevel, args: any) => {
  const envLog = (process.env.LOG_LEVEL ?? "info") as keyof typeof LogLevel;
  if (LogLevel[envLog] < level) {
    return;
  }
  console.log(
    `${colors[level]}\udb85\ude16 [${labels[level]}]\x1b[0m`,
    ...args,
  );
};

export const trace = (...args: unknown[]) => log(LogLevel.trace, args);
export const debug = (...args: unknown[]) => log(LogLevel.debug, args);
export const info = (...args: unknown[]) => log(LogLevel.info, args);
export const warn = (...args: unknown[]) => log(LogLevel.warn, args);
export const error = (...args: unknown[]) => log(LogLevel.error, args);

const funcs = {
  0: error,
  1: warn,
  2: info,
  3: debug,
  4: trace,
};

export const sayAndDo = async (
  script: string,
  opts: SpawnSyncOptionsWithBufferEncoding & { level?: LogLevel } = {
    cwd: process.cwd(),
    stdio: "inherit",
    level: LogLevel.info,
  },
) => {
  const level = opts.level ?? LogLevel.info;
  funcs[level]("> " + script);
  return spawnSync("sh", ["-c", script], opts);
};
