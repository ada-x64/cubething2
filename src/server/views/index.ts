/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyReply, FastifyRequest } from "fastify";
import type { ParsedQs } from "qs";
import { debug } from "scripts/common";
// This is not what you want to edit if you want to change the normal article layout.
// Change static/config/make4ht.cfg
export const index = (app: string) => `
<!doctype html>
<html class="transition" style="display: none">
  <head>
    <script src="/static/scripts/detectTheme.js"></script>
    <script src="/static/js/${app}/index.js" type="module" defer></script>
  </head>
  <body></body>
</html>
`;

export const send = (
  req: FastifyRequest,
  reply: FastifyReply,
  text: string,
  code?: number,
) => {
  let app = req.url.split("/")[1];
  app = app ? app : "root";
  debug("URL:", req.url);
  debug("Rendering app", app);
  const query = req.query as ParsedQs | undefined;
  const noIndex = query?.["no-index"] !== undefined;
  reply.log.info({ query, noIndex });
  return reply
    .header("content-type", "text/html; charset=utf-8")
    .code(code ?? 200)
    .send(noIndex ? text : index(app));
};
