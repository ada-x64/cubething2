/////////////////////////////// cubething.dev /////////////////////////////////

import { globbySync } from "globby";
import Watcher from "watcher";
import { lstatSync } from "fs";
import path from "path";
import { error, info, sayAndDo, warn } from "./common";

let refresh = () => {};
const rerender = async (event?: string, oldpath?: string, newpath?: string) => {
  info(event, oldpath, newpath);
  if (
    oldpath &&
    (path.extname(oldpath) === ".tex" || path.extname(oldpath) === ".md")
  ) {
    await sayAndDo(`bun scripts/render/render.ts ${oldpath}`);
  } else if (oldpath?.includes("static/styles")) {
    sayAndDo(`bun tailwind`);
  } else if (oldpath?.includes("client")) {
    sayAndDo(`HOT=true bun bundle`);
    sayAndDo(`bun tailwind`);
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
      sayAndDo(
        "rsync -av src/static/ www/ --exclude articles --exclude about --exclude styles",
      );
    }
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
