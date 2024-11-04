/////////////////////////////// cubething.dev /////////////////////////////////

import { type ComponentChildren } from "preact";
import { TwClass } from "../styles.ts";
import { html } from "htm/preact/index.js";

export default function MainContent({
  twClass,
  children,
  id,
}: {
  twClass?: string;
  children: ComponentChildren;
  id?: string;
}) {
  return html`
    <article
      id=${id}
      class=${TwClass([twClass ?? "", "order-2"])}
      tabIndex="0"
    >
      ${children}
    </article>
  `;
}
