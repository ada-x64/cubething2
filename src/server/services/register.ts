/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyInstance } from "fastify";
import wakeFp from "./wake";
import path from "path";
import staticFp from "@fastify/static";

export default function registerPlugins(fastify: FastifyInstance) {
  const root = path.join(__dirname, "../../../");
  const staticRoot = path.join(root, "www/");
  fastify.register(staticFp, {
    root: staticRoot,
    decorateReply: false,
    prefix: "/static",
    list: true,
    index: false,
  });
  fastify.register(wakeFp, { prefix: "/wake" });
}
