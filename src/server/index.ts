// Import the framework and instantiate it
import Fastify from "fastify";
import Static from "@fastify/static";
import path from "path";
import Api from "./api.js";
import Routes from "./routes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

const prod = process.env.PROD === "true";
const __dirname = dirname(fileURLToPath(import.meta.url));
const fastify = Fastify({
  logger: {
    level: "debug",
    transport: {
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
          level: "debug",
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
});
if (prod) {
  console.info("Running in production mode!");
}

const root = path.join(__dirname, "../../");
const staticRoot = path.join(root, "www/");

fastify.register(Static, { root: staticRoot });
fastify.register(Static, {
  root: path.join(root, "dist/client"),
  prefix: "/js",
  decorateReply: false,
});
fastify.register(Api, { prefix: "/api/v1", root: staticRoot });
fastify.register(Routes, { root: staticRoot, prod });

// Run the server!
try {
  await fastify.listen({ host: "0.0.0.0", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
