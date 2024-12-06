/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyReply, FastifyRequest } from "fastify";
import type { ParsedQs } from "qs";
// This is not what you want to edit if you want to change the normal article layout.
// Change static/config/make4ht.cfg
export const index = (content: string = "") => `
<!doctype html>
<html>
  <head>
    <script src="/static/js/app.js" type="module"></script>
    <link rel="stylesheet" type="text/css" href="/static/styles/index.css" />
  </head>

  <body>
    <ct-app>
        ${content}
    </ct-app>
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
