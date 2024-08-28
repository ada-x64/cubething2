/////////////////////////////// cubething.dev /////////////////////////////////

import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { send, sendNotFound, sendServerError } from "../views.js";
import { globbySync } from "globby";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

const article = (content: string) => `
          <view-article slot="content">
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

const plugin: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  fastify.get("/articles/:name", (req, reply) => {
    const { name } = req.params as { name: string };
    const dirPath = path.join(opts.root, "articles", name);
    const dir = globbySync(dirPath, { gitignore: true });

    // if there is a cached html file, prefer the html file
    if (opts.prod) {
      const index = dir.find((name) => name === "index.html");
      if (index) {
        const thepath = path.join(dirPath, index);
        const file = readFileSync(thepath).toString("utf8");
        reply.log.info("Serving cached file " + thepath);
        return sendArticle(req, reply, file);
      }
    }

    // if not, try to get the source file
    const main = dir.find((filename) => {
      const split = filename.split("/");
      const regexp = new RegExp(`^(${name}|main)\\.`);
      const res = regexp.test(split[split.length - 1]);
      return res;
    });
    if (!main) {
      return sendNotFound(req, reply);
    }

    // ... then try to render it
    const mainPath = path.join(main);
    const res = spawnSync("pandoc", [mainPath]);
    const stderr = res.stderr.toString();
    const stdout = res.stdout.toString();
    if (stderr) {
      fastify.log.warn(stderr);
    }
    if (res.error) {
      fastify.log.error(res.error);
      return sendServerError(req, reply, res.error);
    }
    if (opts.prod) {
      writeFileSync(path.join(dirPath, "index.html"), stdout);
    }
    reply.log.info("Serving (re)rendered file " + mainPath);
    return sendArticle(req, reply, stdout);
  });

  next();
};

export default plugin;
