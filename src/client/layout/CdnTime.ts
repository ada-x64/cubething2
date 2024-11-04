/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { TwClass, TimeStyle } from "../styles";

export function formatTime(mtime: Date | null) {
  if (mtime !== null) {
    return mtime.toLocaleDateString("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    return null;
  }
}

export default function getTime({
  inline,
  publishedAt,
  lastCommit,
}: {
  inline: boolean;
  publishedAt: Date;
  lastCommit: Date;
}) {
  let style = TwClass([TimeStyle]);
  if (inline) {
    style = TwClass([style, "text-sm"]);
  } else {
    style = TwClass([style, "text-center", "-mt-2", "mb-2"]);
  }

  let time;
  if (publishedAt !== lastCommit) {
    time = html`
      First published ${formatTime(publishedAt)}
      ${(() => {
        if (!inline) {
          return html`<br />`;
        } else {
          return " | ";
        }
      })()}
      Updated ${formatTime(lastCommit)}
    `;
  } else {
    time = formatTime(publishedAt);
  }

  return html`<time class=${style}>${time}</time>`;
}
