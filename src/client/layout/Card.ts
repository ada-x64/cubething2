/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { BorderColor, OutboundLink, TwClass } from "../styles";
import CdnTime from "./CdnTime";
import type { Metadata } from "../utils/metadata";

export default function PostCard(props: { metadata: Metadata }) {
  const { metadata } = props;

  const hoverStyle = OutboundLink.split(" ")
    .map((s) =>
      s.startsWith("hover:")
        ? `hover:[&_h3]:${s.replace("hover:", "")}`
        : `[&_h3]:${s}`,
    )
    .join(" ");

  return html`
    <div class=${TwClass(["mt-4", "pt-4", "border-t", BorderColor])}>
      <a href=${metadata.url}>
        <div
          class=${hoverStyle}
          tabindex="0"
        >
          <h3 class=${"text-lg font-header font-bold"}>
            ${metadata.frontmatter.title}
          </h3>
          <${CdnTime}
            inline=${true}
            lastRender=${metadata.lastRender}
            publishedAt=${metadata.frontmatter.publishedAt}
          />
          <div class="mt-2 font-normal">${metadata.frontmatter.snippet}</div>
        </div>
      </a>
    </div>
  `;
}
