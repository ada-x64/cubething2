/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyReply, FastifyRequest } from "fastify";
import type { ParsedQs } from "qs";
export const index = (content: string = "") => `
<!doctype html>
<html>
  <head>
    <script
      src="/js/app.js"
      type="module"
    ></script>
    <link rel="stylesheet" type="text/css" href="/styles/index.css" />
  </head>

  <body>
    <the-app>
        ${content}
    </the-app>
  </body>
</html>
`;

export const send = (
  req: FastifyRequest,
  reply: FastifyReply,
  text: string,
  code?: number,
) => {
  const query = req.query as ParsedQs | undefined;
  const noIndex = query?.["no-index"] !== undefined;
  reply.log.info({ query, noIndex });
  return reply
    .header("content-type", "text/html; charset=utf-8")
    .code(code ?? 200)
    .send(noIndex ? text : index(text));
};

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
          </view>
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

const home = `<view-home></view-home>`;
export const sendHome = (req: FastifyRequest, reply: FastifyReply) => {
  return send(req, reply, home);
};
