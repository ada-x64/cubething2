/////////////////////////////// cubething.dev /////////////////////////////////

import { LitElement, PropertyValues, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Router } from "@vaadin/router";

// this is required so esbuild doesn't ignore the 'unused' dependency
import("./views/home.js");
import("./views/article.js");

@customElement("the-app")
class App extends LitElement {
  async firstUpdated(props: PropertyValues): Promise<void> {
    super.firstUpdated(props);
    const router = new Router(this.shadowRoot?.querySelector("#outlet"));
    await router.setRoutes([
      { path: "/", component: "view-home" },
      {
        path: "/articles/:fileName",
        component: "view-article",
        action: async (ctx) => {
          const module = await import("./views/article.js");
          const el = new module.default(ctx.params["fileName"] as string);
          return el;
        },
      },
      { path: "(.*)", redirect: "/" },
    ]);
  }

  render() {
    return html`<main id="outlet">
			<button @click=${() => {
        console.log(Router.go("/articles/creating-this-site"));
      }}>go</button
		</main>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "the-app": App;
  }
}
