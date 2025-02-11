/////////////////////////////// cubething.dev /////////////////////////////////

import DarkModeToggle from "../layout/DarkModeToggle";
import Sidebar from "./Sidebar";
import { ArticleNavItems } from "./ArticleNavItems";
import { articleNav, type tNav } from "../nav";
import { html } from "htm/preact/index.js";
import { useLocation } from "preact-iso";

export const allNav: tNav = [];

export default function ArticleNav() {
  const location = useLocation();
  let navigation = allNav;
  if (location.path.includes("articles")) {
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
