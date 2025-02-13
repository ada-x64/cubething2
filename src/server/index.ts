/////////////////////////////// cubething.dev /////////////////////////////////

// Import the framework and instantiate it
import Fastify from "fastify";
import qs from "qs";
import { sendServerError } from "./views/error";
import { send } from "./views";
import { info } from "scripts/common";
import registerPlugins from "./services/register";

const PORT = Number(process.env["PORT"] ?? 3000);
const prod = process.env["PROD"] === "true";
export const fastify = Fastify({
  logger: {
    level: "debug",
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
          level: "warn",
        },
        {
          target: "pino/file",
          options: {
            destination: "server.log",
          },
        },
      ],
    },
  },
  querystringParser: (str) => qs.parse(str),
});
if (prod) {
  console.info("Running in production mode!");
}

// fastify.register(ArticlePlugin, { root: staticRoot, prod });
fastify.setErrorHandler((err, req, reply) => {
  sendServerError(req, reply, err);
});

fastify.get("/favicon.ico", (_req, reply) => {
  reply.redirect("/static/favicon.ico");
});

fastify.get("*", (req, reply) => {
  send(req, reply, "", 200);
});

registerPlugins(fastify);

// Run the server!
try {
  info(`Serving at http://0.0.0.0:${PORT}`);
  await fastify.listen({ host: "0.0.0.0", port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
