/////////////////////////////// cubething.dev /////////////////////////////////

import { FastifyPluginCallback, FastifyReply, FastifyRequest } from "fastify";
import { send, sendNotFound, sendServerError } from "../views.js";
import { globbySync } from "globby";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

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
      reply.log.warn(name, "Could not find the requested article");
      return sendNotFound(req, reply);
    }

    // ... then try to render it
    let res = "";
    const mainPath = path.join(main);
    reply.log.info("Trying to serve (re)rendered file " + mainPath);
    if (main.endsWith(".tex")) {
      const out = spawnSync("make4ht", [mainPath], {});
      const stderr = out.stderr.toString();
      if (stderr) {
        fastify.log.warn(stderr);
      }
      if (out.error) {
        fastify.log.error(out.error);
        return sendServerError(req, reply, out.error);
      }
      res = readFileSync(mainPath.replace(".tex", ".html")).toString();
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
        writeFileSync(path.join(dirPath, "index.html"), res);
      }
    }
    return sendArticle(req, reply, res);
  });

  next();
};

export default plugin;
