/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { AccentText, BorderColor, OutboundIndicator, TwClass } from "../styles";

export default function Title({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  const anchorTitle =
    route === "/"
      ? "home page"
      : route.includes("article")
        ? `article: ${title} - click to go home`
        : `${title} - click to go home`;
  return html`
    <a
      href="/"
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
          "text-orange-500",
          "lowercase",
          "border-b",
          BorderColor,
          "w-full",
          AccentText,
          OutboundIndicator,
        ])}
      >
        ${`< ${title} />`}
      </h1>
    </a>
  `;
}