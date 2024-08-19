// Import the framework and instantiate it
import Fastify from "fastify";
import Static from "@fastify/static";
import path from "path";
import fs from "fs";
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

const root = path.join(import.meta.dirname, "../../");
const index = fs.readFileSync(path.join(root, "www/index.html")).toString();

fastify.register(Static, { root: path.join(root, "www/") });
fastify.register(Static, {
	root: path.join(root, "dist/client"),
	prefix: "/js",
	decorateReply: false,
});
fastify.get(`/`, (req, reply) => {
	reply.header("content-type", " text/html; charset=utf-8").send(index);
});
fastify.setNotFoundHandler((req, reply) => {
	reply.header("content-type", " text/html; charset=utf-8").send(index);
});

// Run the server!
try {
	await fastify.listen({ port: 3000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
