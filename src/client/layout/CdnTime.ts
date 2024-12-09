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
  lastRender,
}: {
  inline: boolean;
  publishedAt: string;
  lastRender: string;
}) {
  const publishedAtDate = new Date(publishedAt);
  const publishedAtStr = formatTime(publishedAtDate);
  const lastCommitDate = new Date(lastRender);
  const lastCommitStr = formatTime(lastCommitDate);
  console.log({ publishedAt, publishedAtDate, publishedAtStr });
  console.log({ lastRender, lastCommitDate, lastCommitStr });

  let style = TwClass([TimeStyle]);
  if (inline) {
    style = TwClass([style, "text-sm"]);
  } else {
    style = TwClass([style, "text-center", "-mt-2", "mb-2"]);
  }

  let time;
  if (publishedAtDate !== lastCommitDate) {
    time = html`
      First published ${publishedAtStr}
      ${(() => {
        if (!inline) {
          return html`<br />`;
        } else {
          return " | ";
        }
      })()}
      Updated ${lastCommitStr}
    `;
  } else {
    time = publishedAtStr;
  }

  return html`<time class=${style}>${time}</time>`;
}
