/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { Palette, OutboundLink, TwClass } from "../styles";
import { useLocation } from "preact-iso";
import { mkHref } from "../nav";

export default function Title({ title }: { title: string }) {
  const location = useLocation();
  const anchorTitle =
    location.path === mkHref("/")
      ? "home page"
      : location.path.includes("article")
        ? `article: ${title} - click to go home`
        : `${title} - click to go home`;
  return html`
    <a
      href="${mkHref("/")}"
      title=${anchorTitle}
    >
      <h1
        id="header"
        class=${TwClass([
          "text-center",
          "py-4",
          "mb-4",
          "text-3xl",
          "font-bold",
          "font-header",
          "lowercase",
          "border-b",
          Palette.borderColor,
          "w-full",
          OutboundLink,
        ])}
      >
        ${`< ${title} />`}
      </h1>
    </a>
  `;
}
