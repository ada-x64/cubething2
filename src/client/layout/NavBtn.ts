/////////////////////////////// cubething.dev /////////////////////////////////

import { TwClass } from "../styles";
import MobileNav, { toggleMobileNav } from "./MobileNav";
import Cube from "../svg/Cube.svg";
import { signal } from "@preact/signals";
import { html } from "htm/preact/index.js";

const ButtonStyle = TwClass([
  "flex",
  "justify-center",
  "align-center",
  "fixed",
  "bottom-4",
  "right-4",
  "text-5xl",
  "lg:right-[20%]",
]);

export const navSignal = signal(false);

export default function NavBtn({ route }: { route: string }) {
  console.log({ route, component: "NavBtn" });
  return html`
    <nav class=${TwClass(["flex", "justify-end", "lg:hidden"])}>
      <button
        id="mobile-nav-button"
        title="toggle navigation modal"
        class=${ButtonStyle}
        onClick=${toggleMobileNav}
      >
        <${Cube} />
      </button>
      <${MobileNav} route=${route} />
    </nav>
  `;
}
