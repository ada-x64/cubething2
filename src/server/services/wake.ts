/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyInstance, FastifyRequest } from "fastify";

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
      `https://api.mcsrvstat.us/bedrock/3/${process.env.WAKE_MC_SERVER_IP}:${process.env.WAKE_MC_SERVER_PORT}`,
    );
  });

  fastify.get(`/send`, async (req: PwReq, reply) => {
    try {
      return reply.redirect(
        `https://${process.env.WAKE_REMOTE_SERVER}/?pw=${req.query.pw}`,
      );
    } catch (e) {
      return reply.status(500).send(e);
    }
  });
}
