import path from "path";
import { lstatSync, readdirSync } from "fs";
import { FastifyPluginCallback } from "fastify";
// api
const api: FastifyPluginCallback<{ root: string }> = (fastify, opts, next) => {
  fastify.get("/tree", (req, reply) => {
    const getTree = (root: string) => {
      if (!lstatSync(root).isDirectory()) {
        return null;
      }
      return readdirSync(root, { withFileTypes: true })
        .filter((obj) => obj.isDirectory())
        .map((obj): { [x: string]: ReturnType<typeof getTree> } => {
          return { [obj.name]: getTree(path.join(root, obj.name)) };
        });
    };
    const tree = getTree(opts.root);
    reply.send(tree);
  });
  next();
};

export default api;
