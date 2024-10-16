/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyRequest, FastifyReply } from "fastify";
import { send } from "./index.js";

const serverError = <T>(error: T) => `
          <article>
            <div slot="header">500 Server Error</div>
            <div slot="message">${error}</div>
          </article>
          `;
export const sendServerError = <T>(
  req: FastifyRequest,
  reply: FastifyReply,
  error: T,
) => {
  return send(req, reply, serverError(error), 500);
};
