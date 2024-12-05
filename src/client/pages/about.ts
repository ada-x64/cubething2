/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import Contact from "../layout/Contact";
import Article from "./article";

export default function About() {
  return html`
    <${Contact} />
    <${Article} routeOverride="/static/about/index.html" />
  `;
}
