/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { useContext } from "preact/hooks";
import Card from "../layout/Card";
import { AppState } from "../app";
import type { Metadata, MetadataMap } from "../utils/metadata";

export default function ArticleList() {
  const state = useContext(AppState);
  console.log(state);
  const articles = state.metadata["articles"] as MetadataMap;
  const list = Object.values(articles)
    .map((dir) => {
      const main = Object.keys(dir as MetadataMap).find((s) =>
        /main\.\w+/.test(s),
      );
      if (main) {
        const metadata = (dir as MetadataMap)[main] as Metadata;
        if (metadata.frontmatter) {
          return { metadata, card: html`<${Card} metadata=${metadata} />` };
        }
      }
    })
    .filter((x) => x !== undefined)
    .sort(
      (a, b) =>
        new Date(b.metadata.frontmatter.publishedAt).valueOf() -
        new Date(a.metadata.frontmatter.publishedAt).valueOf(),
    )
    .map((x) => x.card);

  return html` ${list} `;
}
