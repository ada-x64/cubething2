/////////////////////////////// cubething.dev /////////////////////////////////

import DarkModeToggle from "../svg/DarkTheme.svg";
import Sidebar from "./Sidebar";
import { ArticleNavItems } from "./ArticleNavItems";
import { articleNav, type tNav } from "../nav";
import { html } from "htm/preact/index.js";

export const allNav: tNav = [];

export default function ArticleNav({ route }: { route: string }) {
  console.log("articlenav");
  let navigation = allNav;
  if (route.includes("articles")) {
    navigation = navigation.concat(articleNav);
  }

  return html`
    <${Sidebar}
      order=${"order-3"}
      id="article-nav"
      ariaLabel="article-nav"
      icon=${DarkModeToggle}
      justify="justify-left"
    >
      <${ArticleNavItems} navigation=${navigation} />
    <//>
  `;
}
