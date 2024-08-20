// Import the framework and instantiate it
import Fastify from "fastify";
import Static from "@fastify/static";
import path from "path";
import Api from "./api.js";
import Routes from "./routes.js";
import "dotenv/config.js";

const fastify = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
			},
		},
	},
});

const prod = process.env.prod === "true";
const root = path.join(import.meta.dirname, "../../");
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
	await fastify.listen({ port: 3000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
