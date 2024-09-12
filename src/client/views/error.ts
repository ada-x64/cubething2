/////////////////////////////// cubething.dev /////////////////////////////////

import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("view-error")
export default class ViewError extends LitElement {
  render() {
    return html`
      <div class="error">
        <slot name="header"></slot>
        <slot name="message"></slot>
      </div>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "view-error": ViewError;
  }
}
