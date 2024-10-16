/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import Template from "./template";
import { useSignal, useSignalEffect } from "@preact/signals";
import type { VNode } from "preact";

export default function ArticleList() {
  const list = useSignal<VNode[]>([]);
  useSignalEffect(() => {
    fetch("/list/articles").then((resp) => {
      resp.json().then((json: Record<string, string[]>) => {
        list.value = json["dirs"].map((file) => {
          return html`<li><a href="/articles/${file}">${file}</a></li>`;
        });
      });
    });
  });
  return html`<${Template}>
    <ul>
      ${list.value.length > 0 ? list.value : html`...`}
    </ul>
  <//>`;
}
