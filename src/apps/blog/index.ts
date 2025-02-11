/////////////////////////////// cubething.dev /////////////////////////////////

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { html } from "htm/preact/index.js";
import "preact/debug";

import { createContext, render } from "preact";
import { Router, Route, LocationProvider, ErrorBoundary } from "preact-iso";
import Home from "./pages/home";
import ArticleList from "./pages/articleList";
import Article from "./pages/article";
import NotFound from "./pages/notFound";
import Layout from "./layout/Layout";

import { computed, signal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { type ParsedMetadata, findCurrentMetadata } from "./utils/metadata";
import About from "./pages/about";
import onmousemove from "./utils/onmousemove";
import onScroll from "./utils/onScroll";

// load metadata asap
const metadata = await fetch("/static/meta.json").then(async (data) => {
  return (await data.json()) as ParsedMetadata;
});
const currentMetadata = signal(findCurrentMetadata(metadata));
const defaultState = {
  metadata,
  currentMetadata,
  title: computed(() => {
    return currentMetadata.value?.frontmatter?.title ?? "cubething";
  }),
};

export const AppState = createContext(defaultState);

class App extends HTMLElement {
  connectedCallback() {
    // @ts-expect-error from bun env
    if (process?.env?.HOT === "true") {
      this.tryWebsocket();
    }
    render(
      html`<${AppComponent}></${AppComponent}>`,
      document.querySelector("ct-app")!,
    );
    onmousemove();
    onScroll();
    document.querySelector("html")!.style.display = "block";
    document.querySelector("html")!.style.removeProperty("background");
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
}

customElements.define("ct-app", App);

// n.b. I would like to use preact-iso's lazy loading to delay routing until the article has loaded,
// but i don't seem to be able to do that. I am getting obscure errors.
// Until and unless I figure it out, I'm using signals instead.
function AppComponent() {
  const state = useContext(AppState);
  return html`
    <${LocationProvider}>
      <${ErrorBoundary}>
        <${AppState.Provider} value=${defaultState}>
          <${Layout}>
            <${Router}
              onRouteChange=${() => {
                state.currentMetadata.value = findCurrentMetadata(
                  state.metadata,
                );
              }}
            >
              <${Route}
                path="/"
                component=${Home}
              />
              <${Route}
                path="/articles"
                component=${ArticleList}
              />
              <${Route}
                path="/articles/:id"
                component="${Article}"
              />
              <${Route}
                path="/about"
                component="${About}"
              />
              <${Route}
                default
                component=${NotFound}
              />
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
