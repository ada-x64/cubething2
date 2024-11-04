/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { TwClass } from "../styles";

export default function Footer() {
  return html`<div class=${TwClass(["my-4", "text-center"])}>○</div>`;
}
