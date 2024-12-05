/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import ArticleList from "./articleList";
import { TwClass } from "../styles";

export default function Home() {
  return html`
    <p class=${TwClass(["text-center"])}>
      This is the home page of <a href="/about">Phoenix Ada Rose Mandala.</a>
    </p>
    <${ArticleList} />
  `;
}
