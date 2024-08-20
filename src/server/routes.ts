import { spawnSync } from "child_process";
import { FastifyPluginCallback, FastifyReply } from "fastify";
import { readdirSync, readFileSync } from "fs";
import path from "path";

const routes: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  const notFound = (reply: FastifyReply) => {
    reply
      .code(404)
      .header("content-type", " text/html; charset=utf-8")
      .send(index);
  };
  const found = (reply: FastifyReply, textContent: string) => {
    reply.header("content-type", " text/html; charset=utf-8").send(textContent);
  };
  const index = readFileSync(path.join(opts.root, "index.html")).toString();
  fastify.get(`/`, (req, reply) => {
    return found(reply, index);
  });
  fastify.setNotFoundHandler((req, reply) => {
    return notFound(reply);
  });
  fastify.get("/articles/:name", (req, reply) => {
    const { name } = req.params as { name: string };
    const dirPath = path.join(opts.root, "articles", name);
    const dir = readdirSync(dirPath, {
      withFileTypes: true,
    });
    // if there is a cached html file, prefer the html file
    if (opts.prod) {
      const index = dir.find((dirent) => dirent.name === "index.html");
      if (index) {
        const thepath = path.join(dirPath, index.name);
        const file = readFileSync(thepath).toString("utf8");
        reply.log.info("Serving cached file " + thepath);
        return found(reply, file);
      }
    }
    // otherwise if there's something to render, render it
    const main = dir.find((dirent) => /^main\./.test(dirent.name));
    if (!main || !main.isFile()) {
      return notFound(reply);
    }
    const mainPath = path.join(dirPath, main.name);
    const args = opts.prod
      ? ["-o", path.join(dirPath, "index.html"), mainPath]
      : [mainPath];
    const doc = spawnSync("pandoc", args).stdout.toString();
    reply.log.info("Serving (re)rendered file " + mainPath);
    return found(reply, doc);
  });
  next();
};
export default routes;
