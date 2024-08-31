/////////////////////////////// cubething.dev /////////////////////////////////

import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { send, sendNotFound, sendServerError } from "../views.js";
import { globbySync } from "globby";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";
import { AnsiUp } from "ansi-up";

const ansi_up = new AnsiUp();
const TEX_ROOT = process.env.TEX_ROOT ?? "";

const article = (content: string) => `
          <view-article>
            <div slot='article'>
              ${content}
            </div>
          </view-article>
        `;
export const sendArticle = (
  req: FastifyRequest,
  reply: FastifyReply,
  content: string,
) => {
  return send(req, reply, article(content));
};

const acceptedFiletypes = ["tex", "md"];

const plugin: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  fastify.get("/articles/:name", (req, reply) => {
    const { name } = req.params as { name: string };
    const mainDir = path.join(opts.root, "articles", name);
    const dir = globbySync(mainDir);

    // if there is a cached html file, prefer the html file
    if (opts.prod) {
      const index = dir.find((name) => name === "index.html");
      if (index) {
        const thepath = path.join(mainDir, index);
        const file = readFileSync(thepath).toString("utf8");
        reply.log.info("Serving cached file " + thepath);
        return sendArticle(req, reply, file);
      }
    }

    // if not, try to get the source file
    const main = dir.find((filename) => {
      const basename = path.basename(filename);
      const regexp = new RegExp(`^main\\.(${acceptedFiletypes.join("|")})`);
      const res = regexp.test(basename);
      return res;
    });
    if (!main) {
      reply.log.warn({ message: "Could not find the requested article", name });
      return sendNotFound(req, reply);
    }

    // ... then try to render it
    let res = "";
    const mainPath = path.join(main);
    reply.log.info("Trying to serve (re)rendered file " + mainPath);
    if (main.endsWith(".tex")) {
      const out = spawnSync(
        "sh",
        [
          "-c",
          `
            ${path.join(TEX_ROOT, "make4ht")} -j index -d ${path.join(mainDir, "out")} -f html5+latexmk_build ${mainPath} "fn-in,TocLink,css-in";
            ${path.join(TEX_ROOT, "make4ht")} -j index -m clean ${mainPath}
          `,
        ],
        { cwd: path.dirname(mainPath) },
      );
      if (out.stdout) {
        reply.log.debug({ stdout: out.stdout.toString() });
      }
      if (out.stderr) {
        reply.log.warn({ stderr: out.stderr.toString() });
      }
      if (out.error) {
        reply.log.error({ error: out.error });
      }
      try {
        // trim to inner content and properly link css
        let html = readFileSync(
          path.join(mainDir, "out/index.html"),
        ).toString();
        html = /<body>((.|\n)*)<\/body>/gi.exec(html)?.[1] ?? html;
        res = `<link href="./${name}/out/index.css" rel="stylesheet">` + html;
      } catch {
        return sendServerError(
          req,
          reply,
          ansi_up
            .ansi_to_html(out.output.toString())
            .replaceAll("\n", "\n<br>\n"),
        );
      }
    } else {
      const out = spawnSync("pandoc", [mainPath]);
      const stderr = out.stderr.toString();
      res = out.stdout.toString();
      if (stderr) {
        fastify.log.warn(stderr);
      }
      if (out.error) {
        fastify.log.error(out.error);
        return sendServerError(req, reply, out.error);
      }
      if (opts.prod) {
        writeFileSync(path.join(mainDir, "index.html"), res);
      }
    }
    return sendArticle(req, reply, res);
  });

  next();
};

export default plugin;
