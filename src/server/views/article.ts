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

const acceptedFiletypes = ["tex", "md", "html"];

const plugin: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  fastify.get("/articles/:name", (req, reply) => {
    const { name } = req.params as { name: string };
    const dirPath = path.join(opts.root, "articles", name);
    const dir = globbySync(dirPath);

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
        "make4ht",
        [
          "-j",
          "index",
          "-f",
          "html5",
          "-d",
          path.dirname(mainPath),
          "-s",
          mainPath,
        ],
        { cwd: "/usr/bin" }, // would really prefer not to dump all the temp files here but OH WELL
      );
      const stderr = out.stderr.toString();
      fastify.log.debug({ stdout: out.stdout });
      if (stderr) {
        fastify.log.error(stderr);
        return sendServerError(req, reply, stderr);
      }
      res = readFileSync(path.dirname(mainPath) + "/index.html").toString();
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
