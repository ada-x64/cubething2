/////////////////////////////// cubething.dev /////////////////////////////////

import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("view-article")
export default class ViewArticle extends LitElement {
  render() {
    return html` <slot name="article"></slot> `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "view-article": ViewArticle;
  }
}
