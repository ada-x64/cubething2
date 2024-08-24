import { execSync, spawn } from "child_process";
import { context } from "esbuild";

const watch = process.argv.includes("--watch");
const run = process.argv.includes("--watch") || process.argv.includes("--run");
const PROD = process.argv.includes("--prod");
const main = "index.js";
const outdir = "dist";
let app;
async function doit() {
  const clientCtx = await context({
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
  if (watch) {
    await clientCtx.watch();
  } else {
    await clientCtx.rebuild();
    await clientCtx.dispose();
  }

  const serverCtx = await context({
    entryPoints: ["./src/server/**/*"],
    outdir: `${outdir}/server`,
    bundle: false,
    platform: "node",
    loader: {
      ".ts": "ts",
    },
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
                "\x1b[33m\udb85\udc0b Server build completed \x1b[0m",
              );
            } else {
              console.log(
                "\x1b[31m\ue654\udb85\udc0b  Server build failed\x1b[0m",
              );
            }
            if (run) {
              app?.kill();
              const apppath = `./${outdir}/server/${main}`;
              console.log(`> node ${apppath}`);
              const launch = () => {
                try {
                  app = spawn("node", [apppath], {
                    cwd: "./",
                    stdio: "inherit",
                    // @ts-expect-error don't worry about it
                    env: { PROD },
                  });
                } catch {
                  console.error("failed to launch, trying again");
                  setTimeout(launch, 10);
                }
              };
              launch();
            }
          });
        },
      },
    ],
  });
  if (watch) {
    await serverCtx.watch();
  } else {
    await serverCtx.rebuild();
    await serverCtx.dispose();
  }
}
doit();
