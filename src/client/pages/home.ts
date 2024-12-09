/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import ArticleList from "./articleList";
import { OutboundIndicator, TwClass } from "../styles";

export default function Home() {
  //prettier-ignore
  return html`
    <p class=${TwClass(["text-center"])}>
      This is the home page of
      <a
        href="/about"
        class=${OutboundIndicator}
      > Phoenix Ada Rose Mandala</a>,
      aka <em><b>cube</b></em>.
    </p>
    <${ArticleList} />
  `;
}
