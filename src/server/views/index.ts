/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyReply, FastifyRequest } from "fastify";
import { readdirSync } from "fs";
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
    <link rel="stylesheet" href="/static/styles/index.css" />
    <link rel="preload" href="/static/font/Chillax-Regular.otf" as="font" type="font/otf" crossorigin/>
    <link rel="preload" href="/static/font/Synonym-Regular.otf" as="font" type="font/otf" crossorigin/>
  </head>
  <body></body>
</html>
`;

const apps = readdirSync("www/js/", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

export const send = (
  req: FastifyRequest,
  reply: FastifyReply,
  text: string,
  code?: number,
) => {
  let app = req.url.split("/")[1];
  if (!apps.includes(app)) {
    app = process.env.DEFAULT_APP;
  }
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
