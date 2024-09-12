/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyPluginCallback } from "fastify";
import { sendHome } from "./views/index.js";
import articlesPlugin from "./views/article.js";

const routes: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  fastify.get(`/`, (req, reply) => {
    return sendHome(req, reply);
  });

  fastify.register(articlesPlugin, opts);

  next();
};
export default routes;
