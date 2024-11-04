/////////////////////////////// cubething.dev /////////////////////////////////

import HomeBtn from "./HomeBtn";
import Sidebar from "./Sidebar";
import { MainNavItems } from "./MainNavItems";
import { mainNav } from "../nav";
import { html } from "htm/preact/index.js";

export default function MainNav({ route }: { route: string }) {
  console.log("mainnav");
  return html`
    <${Sidebar}
      order=${"order-1"}
      id=${"main-nav"}
      ariaLabel=${"main-nav"}
      icon=${HomeBtn}
      justify="justify-right"
    >
      <${MainNavItems}
        navigation=${mainNav}
        route=${route}
      />
    <//>
  `;
}
