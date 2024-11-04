/////////////////////////////// cubething.dev /////////////////////////////////

import { type tNav } from "../nav";
import {
  ItemListStyle,
  ItemSelectedStyle,
  ItemStyle,
  OutboundLink,
  TwClass,
} from "../styles";
import { closeMobileNav } from "../layout/MobileNav";
import { html } from "htm/preact/index.js";

export function MainNavItems({
  navigation,
  route,
}: {
  navigation: tNav;
  route: string;
}) {
  const items = navigation.map((item) => {
    const current = item.href === route;
    if (current) {
      return html`
        <div class=${[ItemStyle, ItemSelectedStyle].join(" ")}>
          ${item.name}
        </div>
      `;
    } else {
      return html`
        <a
          key=${item.name}
          href=${current ? "#" : item.href}
          title=${item.name}
          tabindex=${0}
          class=${TwClass([ItemStyle, OutboundLink])}
          aria-current=${current ? "page" : undefined}
          onClick=${closeMobileNav}
        >
          ${item.name}
        </a>
      `;
    }
  });
  return html`<div class=${ItemListStyle}>${items}</div>`;
}
