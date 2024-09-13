/////////////////////////////// cubething.dev /////////////////////////////////

import type {
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { send } from "./index.js";
import { sendNotFound, sendServerError } from "./error.js";
import { AnsiUp } from "ansi-up";
import { readFileSync } from "fs";
import path from "path";

const ansi_up = new AnsiUp();

const article = (content: string) => `
          <view-article>
            <div slot='article'>
              ${content}
            </div>
          </view-article>
        `;
export const sendArticle = (
  req: FastifyRequest,
  reply: FastifyReply,
  content: string,
) => {
  return send(req, reply, article(content));
};
const sendError = (req: FastifyRequest, reply: FastifyReply, error: object) => {
  sendServerError(
    req,
    reply,
    Object.entries(error)
      .map(([k, v]) => {
        return `<h2>${k}</h2><pre><code>${ansi_up.ansi_to_html(v)}</pre></code>`;
      })
      .join(""),
  );
};

const plugin: FastifyPluginCallback<{ root: string; prod: boolean }> = (
  fastify,
  opts,
  next,
) => {
  fastify.get("/articles", async (req, reply) => {
    send(req, reply, "<view-article-index />");
  });
  fastify.get("/:name", async (req, reply) => {
    const { name } = req.params as { name: string };
    const filepath = path.join(opts.root, name, "index.html");
    try {
      const res = readFileSync(filepath).toString();
      sendArticle(req, reply, res);
    } catch {
      try {
        const res = JSON.parse(
          readFileSync(
            path.join("build", name ?? "markup", "error.json"),
          ).toString(),
        );
        sendError(req, reply, res);
      } catch (error) {
        const e = (error as string) + "\n" + filepath;
        sendNotFound(req, reply, ansi_up.ansi_to_html(e));
      }
    }
  });

  next();
};

export default plugin;
