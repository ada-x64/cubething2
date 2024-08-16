import { execSync, spawn } from "child_process";
import { context } from "esbuild";

const main = "index.js";
const outdir = "dist";
let app;
async function run() {
  let clientCtx = await context({
    entryPoints: ["src/client/app.ts"],
    outdir: `${outdir}/client`,
    bundle: true,
    platform: "browser",
    minify: true,
    sourcemap: "inline",
    loader: {
      ".ts": "ts",
    },
    tsconfig: "tsconfig.json",
    plugins: [
      {
        name: "rebuild-notify",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              console.log("\x1b[34m\uf0ac Browser build completed \x1b[0m");
            } else {
              console.log("\x1b[31m\ue654\uf0ac Browser build failed\x1b[0m");
            }
          });
        },
      },
    ],
  });
  await clientCtx.watch();

  let serverCtx = await context({
    entryPoints: ["./src/server/**/*", "./src/common/**/*"],
    outdir: `${outdir}/server`,
    bundle: false,
    platform: "node",
    loader: {
      ".ts": "ts",
      ".html": "file",
      ".md": "file",
      ".tex": "file",
    },
    assetNames: "[name]",
    tsconfig: "tsconfig.json",
    plugins: [
      {
        name: "rebuild-notify",
        setup(build) {
          build.onStart(async () => {
            execSync("rm -rf out/server");
          });
          build.onEnd((result) => {
            if (result.errors.length === 0) {
              console.log(
                "\x1b[33m\udb85\udc0b Server build completed \x1b[0m"
              );
            } else {
              console.log(
                "\x1b[31m\ue654\udb85\udc0b  Server build failed\x1b[0m"
              );
            }
            app?.kill();
            const apppath = `${outdir}/server/${main}`;
            console.log(`> node ${apppath}`);
            app = spawn("node", [apppath], { stdio: "inherit" });
          });
        },
      },
    ],
  });
  await serverCtx.watch();
}
run();
