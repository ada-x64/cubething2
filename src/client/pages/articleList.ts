/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { useContext } from "preact/hooks";
import Card from "../layout/Card";
import { AppState } from "../app";
import type { Metadata, MetadataMap } from "../utils/metadata";

export default function ArticleList() {
  const state = useContext(AppState);
  const articles = state.metadata["articles"] as MetadataMap;
  const list = Object.values(articles)
    .map((dir) => {
      const main = Object.keys(dir as MetadataMap).find((s) =>
        /main\.\w+/.test(s),
      );
      if (main) {
        const metadata = (dir as MetadataMap)[main] as Metadata;
        if (metadata.frontmatter) {
          return html`<${Card} metadata=${metadata} />`;
        }
      }
    })
    .filter((x) => x !== undefined);

  return html` ${list} `;
}
