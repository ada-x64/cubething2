/////////////////////////////// cubething.dev /////////////////////////////////

import { FastifyPluginCallback } from "fastify";
import { sendNotFound, sendHome } from "./views.js";
import articlesPlugin from "./views/article.js";

const routes: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  fastify.get(`/`, (req, reply) => {
    return sendHome(req, reply);
  });

  fastify.setNotFoundHandler((req, reply) => {
    return sendNotFound(req, reply);
  });

  fastify.register(articlesPlugin, opts);

  next();
};
export default routes;
