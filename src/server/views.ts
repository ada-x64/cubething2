/////////////////////////////// cubething.dev /////////////////////////////////

import { FastifyReply, FastifyRequest } from "fastify";
import { ParsedQs } from "qs";

export const index = (content: string = "") => `
<!doctype html>
<html>
  <head>
    <script
      src="/js/app.js"
      type="module"
    ></script>
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
) => {
  const query = req.query as ParsedQs | undefined;
  const noIndex = query?.["no-index"] !== undefined;
  reply.log.info({ query, noIndex });
  return reply
    .header("content-type", "text/html; charset=utf-8")
    .send(noIndex ? text : index(text));
};

const notFound = `
          <view-error>
            <div slot="header">
              404 Not Found
            </div>
            <div slot="message">
              <p>Could not find that page.<p>
              <a href="/">Go home.</a>
            </div>
          </view>
          `;
export const sendNotFound = (req: FastifyRequest, reply: FastifyReply) => {
  return send(req, reply, notFound).code(404);
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
  return send(req, reply, serverError(error)).code(500);
};

const home = `<view-home></view-home>`;
export const sendHome = (req: FastifyRequest, reply: FastifyReply) => {
  return send(req, reply, home);
};
