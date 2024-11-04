/////////////////////////////// cubething.dev /////////////////////////////////

import { type tNav } from "../nav";
import { InboundLink, ItemListStyle, ItemStyle } from "../styles";
import { closeMobileNav } from "../layout/MobileNav";
import { html } from "htm/preact/index.js";

export function ArticleNavItems({ navigation }: { navigation: tNav }) {
  const items = navigation.map((item) => {
    return html`
      <a
        key=${item.name}
        href=${item.href}
        title=${item.name}
        tabindex=${0}
        class=${ItemStyle.concat(InboundLink)}
        onClick=${closeMobileNav}
      >
        ${item.name}
      </a>
    `;
  });
  return html`<div class="${ItemListStyle}">${items}</div>`;
}
