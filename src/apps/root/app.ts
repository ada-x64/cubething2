/////////////////////////////// cubething.dev /////////////////////////////////

import type { AppConfig } from "scripts/bundle";

let metadata = (await (
  await fetch("static/js/meta.json")
).json()) as AppConfig[];

export default class Root extends HTMLElement {
  connectedCallback() {
    if (process.env.SHOW_PRIVATE_APPS !== "true") {
      metadata = metadata.filter((appcfg) => appcfg.public);
    }
    const links = metadata.map(
      (appcfg) =>
        `<a href=${appcfg.root} title=${appcfg.title}>${appcfg.title}</a>`,
    );
    this.innerHTML = `
      <div>
        ${links.join("\n")}
      </div>
    `;
    document.getElementsByTagName("html")[0]!.style.removeProperty("display");
  }
}

export function bootstrap() {
  const head = document.getElementsByTagName("head")[0]!;
  head.innerHTML = `
      <link rel="stylesheet" href="/static/styles/index.css" />
      <link rel="preload" href="/static/font/Chillax-Regular.otf" as="font" type="font/otf" crossorigin/>
      <link rel="preload" href="/static/font/Synonym-Regular.otf" as="font" type="font/otf" crossorigin/>
      <style>
        ct-root div {
          display: flex;
          position: absolute;
          bottom: 2em;
          font-size: 3em;
          gap: 1em;
          justify-content: center;
          width: 100vw;
        }
        ct-root a {
          text-decoration: none;
          color: transparent;
          transition: 1s;
        }
      </style>
  `;
  customElements.define("ct-root", Root);
  document.body.append(document.createElement("ct-root"));
}
