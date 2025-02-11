/////////////////////////////// cubething.dev /////////////////////////////////

import Cube from "../svg/Cube.svg";
import { html } from "htm/preact/index.js";

export default function HomeBtn() {
  return html`
    <a
      id="homeBtn"
      href="/"
      title="home"
      tabindex=${0}
    >
      <${Cube} />
    </a>
  `;
}
