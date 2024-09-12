/////////////////////////////// cubething.dev /////////////////////////////////

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { customElement } from "lit/decorators.js";
import { LitElement, type PropertyValues, css, html } from "lit";
import { type Match, default as Navigo } from "navigo";

import("./views/article.js");
import("./views/home.js");
import("./views/error.js");

@customElement("the-app")
class App extends LitElement {
  static shadowRootOptions: ShadowRootInit = {
    ...super.shadowRootOptions,
    mode: "open",
  };

  static styles = css`
    *:not:defined {
      display: none;
    }
  `;

  shouldRoute: boolean = false;

  constructor() {
    super();
    // @ts-expect-error Fsr the navigo impogrt fails to resolve correctly in the ide.
    const router: Navigo.default = new Navigo("/", {
      linksSelector: "a[href^='/']",
    });
    router.on(
      "*",
      async (match?: Match) => {
        if (!this.shouldRoute) {
          return;
        }
        for (const child of this.children) {
          console.log(child);
          child.remove();
        }
        const res = await fetch("/" + match!.url + "?no-index");
        const text = await res.text();
        const container = document.createElement("div");
        container.innerHTML = text;
        this.appendChild(container.firstElementChild!);
      },
      {
        already: () => {},
      },
    );

    router.resolve();
  }

  async firstUpdated(props: PropertyValues): Promise<void> {
    super.firstUpdated(props);
    this.shouldRoute = true;
    //@ts-expect-error Defined at bundle time
    if (BUILD_INFO.HOT) {
      this.tryWebsocket();
    }
  }

  tryWebsocket = () => {
    const ws = new WebSocket("ws://127.0.0.1:4444");
    ws.onopen = () => {
      console.info("Connected to dev ws!");
    };
    ws.onmessage = (event) => {
      if (event.data.toString() === "refresh") {
        window.location.reload();
      }
    };
    ws.onclose = () => {
      console.warn("Websocket connection closed. Retrying in 5 seconds.");
      setTimeout(this.tryWebsocket, 5000);
    };
  };

  render() {
    return html`<!---->
      <!-- <ct-sidebars></ct-sidebars> -->
      <main id="outlet">
        <slot></slot>
      </main>
      <!---->`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "the-app": App;
  }
}
