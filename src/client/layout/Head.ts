/////////////////////////////// cubething.dev /////////////////////////////////

// import { Head } from "$fresh/src/runtime/head.ts";
// import { CDN_URL } from "@/deps/paths.ts";

import { html } from "htm/preact/index.js";

const description =
  "Personal home page of Ada Mandala. Posts about tech, art, philosophy. // Rust, Linux, WASM // Graphics, Games // Metaphysics, Aesthetics";
const stylesheets = [
  "code",
  "global",
  "index",
  "katex",
  "libertinus",
  "sty",
  "toc",
  "Fonts",
];

export default function HeadComponent() {
  console.log({ component: "HeadComponent" });
  return html`
    <head>
      <link
        rel="icon"
        href="/favicon.ico"
        type="image/vnd.microsoft.icon"
      />
      <link
        rel="icon"
        href="/favicon.png"
        type="image/png"
      />
      <!-- Starry-night code highlighter theme -->
      <link
        rel="stylesheet"
        href="https://esm.sh/@wooorm/starry-night@2/style/dark.css"
      />
      ${stylesheets.map((name) => {
        return html`
          <link
            rel="stylesheet"
            href="/static/styles/${name}.css"
          />
        `;
      })}

      <!-- Primary Meta Tags -->
      <meta
        name="title"
        content="< cubething />"
      />
      <meta
        name="description"
        content=""
      />

      <!-- Open Graph / Facebook -->
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:url"
        content="https://cubething.dev/"
      />
      <meta
        property="og:title"
        content="< cubething />"
      />
      <meta
        property="og:description"
        content=${description}
      />
      <meta
        property="og:image"
        content=${"/static/meta/preview.png"}
      />

      <!-- Twitter -->
      <meta
        property="twitter:card"
        content="summary_large_image"
      />
      <meta
        property="twitter:url"
        content="https://cubething.dev/"
      />
      <meta
        property="twitter:title"
        content="< cubething />"
      />
      <meta
        property="twitter:description"
        content=${description}
      />
      <meta
        property="twitter:image"
        content="static/meta/preview.png"
      />
    </head>
  `;
}
