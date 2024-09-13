/////////////////////////////// cubething.dev /////////////////////////////////

// Import the framework and instantiate it
import Fastify from "fastify";
import Static from "@fastify/static";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import qs from "qs";

const PORT = Number(process.env["PORT"] ?? 3000);
const prod = process.env["PROD"] === "true";
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
  querystringParser: (str) => qs.parse(str),
});
if (prod) {
  console.info("Running in production mode!");
}

const root = path.join(__dirname, "../../");
const staticRoot = path.join(root, "www/");

// fastify.register(ArticlePlugin, { root: staticRoot, prod });
fastify.register(Static, {
  root: staticRoot,
});

// Run the server!
try {
  await fastify.listen({ host: "0.0.0.0", port: PORT });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
