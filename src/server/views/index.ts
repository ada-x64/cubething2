/////////////////////////////// cubething.dev /////////////////////////////////

import type { FastifyReply, FastifyRequest } from "fastify";
import type { ParsedQs } from "qs";
// This is not what you want to edit if you want to change the normal article layout.
// Change static/config/make4ht.cfg
export const index = (content: string = "") => `
<!doctype html>
<html class="transition" style="display: none">
  <head>
    <script src="/static/scripts/detectTheme.js"></script>
    <script src="/static/js/app.js" type="module" defer></script>
    <link rel="stylesheet" href="/static/styles/index.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.15/dist/katex.min.css" integrity="sha384-Htz9HMhiwV8GuQ28Xr9pEs1B4qJiYu/nYLLwlDklR53QibDfmQzi7rYxXhMH/5/u" crossorigin="anonymous">
    <link rel="preload" href="/static/font/Chillax-Regular.otf" as="font" type="font/otf" crossorigin/>
    <link rel="preload" href="/static/font/Synonym-Regular.otf" as="font" type="font/otf" crossorigin/>
    <link rel="preload" href="/static/font/Fira-Code-Regular-Nerd-Font-Complete-Mono.ttf" as="font" type="font/ttf" crossorigin/>
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
