/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyInstance, FastifyRequest } from "fastify";
import { Socket } from "net";
import { debug, error, info, warn } from "scripts/common";

function wake() {
  return new Promise((resolve, reject) => {
    try {
      const client = new Socket();
      const port = +process.env.WAKE_REMOTE_PORT;
      const ip = process.env.WAKE_REMOTE_IP;
      client.connect(port, ip, () => {
        info("Connected to WAKE_SERVER");
        const msg =
          "hello from cubething.dev/wake @ " + new Date().toISOString();
        debug("Writing message:", msg);
        client.write(msg, () => {
          client.destroy();
        });
      });
      client.on("close", () => {
        debug("Closed");
        resolve({});
      });
      client.on("error", () => {
        warn("WAKE_SERVER connection failed");
        reject({});
      });
    } catch (e) {
      error(e);
      reject(e);
    }
  });
}

export default async function (fastify: FastifyInstance) {
  type PwReq = FastifyRequest<{ Querystring: { pw: string } }>;
  const PW = process.env.WAKE_PW;

  fastify.addHook("preHandler", (req: PwReq, reply, done) => {
    if (req.query.pw !== PW) {
      reply.status(403).send();
    }
    done();
  });

  fastify.get(`/status`, async (_req: PwReq, reply) => {
    // query server for status
    return reply.redirect(
      `https://api.mcsrvstat.us/bedrock/3/${process.env.WAKE_REMOTE_IP}:${process.env.WAKE_REMOTE_PORT}`,
    );
  });

  fastify.get(`/send`, async (_req: PwReq, reply) => {
    try {
      await wake();
      return reply.status(200).send("ok");
    } catch (e) {
      return reply.status(500).send(e);
    }
  });
}
