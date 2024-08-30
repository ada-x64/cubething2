/////////////////////////////// cubething.dev /////////////////////////////////

import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("view-article")
export default class ViewArticle extends LitElement {
  render() {
    return html`
      <article
        id="article"
        class="latex-dark-auto"
      >
        <slot name="article"></slot>
      </article>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "view-article": ViewArticle;
  }
}
