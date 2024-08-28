/////////////////////////////// cubething.dev /////////////////////////////////

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { customElement } from "lit/decorators.js";
import { LitElement, PropertyValues, css, html } from "lit";
import { Match, default as Navigo } from "navigo";

@customElement("the-app")
class App extends LitElement {
  static styles = css`
    the-app:not:defined {
      display: none;
    }
  `;

  async firstUpdated(props: PropertyValues): Promise<void> {
    super.firstUpdated(props);
    // @ts-expect-error Fsr the navigo import fails to resolve correctly in the ide.
    const router: Navigo.default = new Navigo("/");
    router.on("*", async (match?: Match) => {
      const res = await fetch(match!.url + "?no-index");
      const text = await res.text();
      const container = document.createElement("div");
      container.innerHTML = text;
      this.appendChild(container.firstElementChild!);
    });

    router.resolve();
  }

  render() {
    return html`<!---->
      <!-- <ct-sidebars></ct-sidebars> -->
      <main id="outlet">
        <slot name="content"></slot>
      </main>
      <!---->`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "the-app": App;
  }
}
