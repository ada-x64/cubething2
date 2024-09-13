/////////////////////////////// cubething.dev /////////////////////////////////

import { globbySync } from "globby";
import Watcher from "watcher";
import { lstatSync } from "fs";
import cp from "child_process";
import path from "path";

const log = (kind: "info" | "warn" | "error", ...args: unknown[]) => {
  const color =
    kind === "info" ? "\x1b[34m" : kind === "warn" ? "\x1b[93m" : "\x1b[91m";
  console.log(`${color}\udb85\ude16 ${args.join(" ")}\x1b[0m`);
};
const info = (...args: unknown[]) => log("info", args);
const error = (...args: unknown[]) => log("error", args);
const warn = (...args: unknown[]) => log("warn", args);

const sayAndDo = async (script: string) => {
  info("> " + script);
  return cp.spawnSync("sh", ["-c", script], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
};

let refresh = () => {};
const rerender = async (event?: string, oldpath?: string, newpath?: string) => {
  info(event, oldpath, newpath);
  if (oldpath?.includes("articles")) {
    await sayAndDo(`bun scripts/render/render.ts ${oldpath}`);
  } else if (oldpath?.includes("static")) {
    // TODO: This is kinda buggy.
    // Folder actions can get missed.
    const wwwpath = (newpath ?? oldpath).replace("src", "www");
    if (event === "unlink") {
      const isdir = lstatSync(wwwpath, {
        throwIfNoEntry: false,
      })?.isDirectory();
      await sayAndDo(`rm ${isdir ? "-r" : ""} ${wwwpath}`);
    } else if (event === "unlinkDir") {
      await sayAndDo(`rm -r ${wwwpath}`);
    } else {
      const inpath = newpath ?? oldpath;
      const isdir = lstatSync(inpath, { throwIfNoEntry: false })?.isDirectory();
      if (isdir) {
        await sayAndDo(`mkdir -p ${wwwpath}`);
      } else {
        await sayAndDo(`cp ${newpath ?? oldpath} ${wwwpath}`);
      }
    }
  } else if (oldpath?.includes("styles")) {
    sayAndDo(`bun sass`);
  } else if (oldpath?.includes("client")) {
    sayAndDo(`HOT=true bun bundle`);
  }
  refresh();
};

const PORT = Number(process.env["PORT"] ?? 4444);

info(`Booting hot reload server at ws://127.0.0.1:${PORT}...`);
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
  persistent: true,
  ignoreInitial: true,
  ignore: (filepath) => {
    // const lstat = fs.lstatSync(filepath, { throwIfNoEntry: false });
    // if (!lstat || lstat.isDirectory()) {
    //   // console.log(filepath, "not ignored");
    //   return false;
    // }
    const src = path.join(process.cwd(), "src");
    const folders = globbySync(src, { onlyDirectories: true });
    const files = globbySync(filepath, {
      gitignore: true,
      globstar: true,
    });
    const out = folders.concat(files, src);
    const ignored = !out.includes(filepath);
    return ignored;
  },
});
watcher.on("all", rerender);
watcher.on("error", (e) => error(e));
watcher.on("ready", () => info("Watcher ready!"));
watcher.on("close", () => warn("Watcher closed!"));
