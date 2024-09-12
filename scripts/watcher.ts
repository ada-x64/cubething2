/////////////////////////////// cubething.dev /////////////////////////////////

import { $ } from "bun";
import { globbySync } from "globby";
import Watcher from "watcher";
import fs from "fs";

const log = (kind: "info" | "warn" | "error", ...args: unknown[]) => {
  const color =
    kind === "info" ? "\x1b[34m" : kind === "warn" ? "\x1b[93m" : "\x1b[91m";
  console.log(`${color}\udb85\ude16 ${args}\x1b[0m`);
};
const info = (...args: unknown[]) => log("info", args);
// const error = (...args: unknown[]) => log("error", args);
const warn = (...args: unknown[]) => log("warn", args);

let refresh = () => {};
const rerender = async (event?: string, path?: string) => {
  if (event && path) {
    info(`Detected ${event} at ${path}`);
  }
  let out;
  if (path?.includes("articles")) {
    await $`bun scripts/render/render.ts | ${out}`;
  }
  refresh();
};

const PORT = Number(process.env["PORT"] ?? 4444);

info(`Hot reloading server at ws://127.0.0.1:${PORT}`);
Bun.serve({
  port: PORT,
  hostname: "127.0.0.1",
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message: (_socket, msg) => {
      info("\udb85\ude16 Got msg", msg);
    },
    open: (socket) => {
      info("\udb85\ude16 Websocket opened");
      refresh = () => {
        info("\udb85\ude16 Hot reloading client");
        socket.send("refresh");
      };
    },
    close: () => {
      info("\udb85\ude16 Websocket closed");
      refresh = () => {
        warn("\udb85\ude16 Tried to refresh when socket closed");
      };
    },
  }, // handlers
});
const watcher = new Watcher("src/", {
  recursive: true,
  renameDetection: true,
  persistent: true,
  ignoreInitial: true,
  ignore: (filepath) => {
    if (fs.lstatSync(filepath, { throwIfNoEntry: false })?.isDirectory()) {
      return false;
    }
    const out = globbySync(filepath, {
      ignore: ["**/error.json"],
      gitignore: true,
    });
    return !out.includes(filepath);
  },
});
watcher.on("all", rerender);
