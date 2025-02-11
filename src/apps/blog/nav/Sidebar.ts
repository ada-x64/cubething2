/////////////////////////////// cubething.dev /////////////////////////////////

import type { ComponentChildren, VNode } from "preact";
import { TwClass } from "../styles";
import { ItemContainerStyle } from "../styles";
import { html } from "htm/preact/index.js";

export default function Sidebar({
  icon,
  order,
  ariaLabel,
  id,
  children,
  justify,
}: {
  icon: VNode;
  order: "order-1" | "order-2" | "order-3";
  ariaLabel: string;
  id: string;
  children: ComponentChildren;
  justify: "justfy-left" | "justify-right";
}) {
  return html`
    <nav
      aria-label=${ariaLabel}
      class=${TwClass([
        "h-fit",
        "flex-auto",
        "px-4",
        "text-xl",
        "font-sans",
        "sticky",
        "top-0",
        order,
        "opacity-100",
        "transition-all",
        "ease-linear",
        "hover:opacity-100",
        justify,
        "focus:opacity-100",
        "lg:flex",
        "hidden",
      ])}
      tabIndex=${-1}
      id=${id}
    >
      <div class="w-24">
        <div class=${ItemContainerStyle.concat(" mb-4")}><${icon} /></div>
        ${children}
      </div>
    </nav>
  `;
}
