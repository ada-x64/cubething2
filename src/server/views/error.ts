/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyRequest, FastifyReply } from "fastify";
import { send } from "./index.js";

const notFound = (msg?: string) => `
          <view-error>
            <div slot="header">
              404 Not Found
            </div>
            <div slot="message">
              <p>Could not find that page.<p>
              <a href="/">Go home.</a>
              ${msg ? `<pre><code>${msg}</pre></code>` : ``}
            </div>
          </view-error>
          `;
export const sendNotFound = (
  req: FastifyRequest,
  reply: FastifyReply,
  msg?: string,
) => {
  return send(req, reply, notFound(msg), 404);
};

const serverError = <T>(error: T) => `
          <view-error>
            <div slot="header">500 Server Error</div>
            <div slot="message">${error}</div>
          </view-error>
          `;
export const sendServerError = <T>(
  req: FastifyRequest,
  reply: FastifyReply,
  error: T,
) => {
  return send(req, reply, serverError(error), 500);
};
