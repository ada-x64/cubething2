/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { TwClass, TimeStyle, Palette } from "../styles";
import { type Frontmatter } from "../utils/metadata";

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
  frontmatter,
}: {
  inline: boolean;
  frontmatter: Frontmatter;
}) {
  const publishedAt = frontmatter.publishedAt;
  const publishedAtStr = formatTime(new Date(publishedAt));
  const lastEdit = frontmatter.lastEdit;
  const lastEditStr = lastEdit ? formatTime(new Date(lastEdit)) : null;

  let style = TwClass([TimeStyle]);
  if (inline) {
    style = TwClass([style, "text-sm"]);
  } else {
    style = TwClass([
      style,
      "text-center",
      "-mt-2",
      "mb-4",
      "pb-2",
      "border-b",
      Palette.borderColor,
    ]);
  }

  const separator = inline ? html`|` : html`<br />`;
  const withEdit = lastEditStr
    ? html`${separator} Updated ${lastEditStr}`
    : null;
  const time = html`First published ${publishedAtStr} ${withEdit}`;

  return html`<time class=${style}>${time}</time>`;
}
