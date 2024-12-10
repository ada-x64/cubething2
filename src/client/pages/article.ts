/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { useRoute } from "preact-iso";
import { useSignal, useSignalEffect } from "@preact/signals";
import { InboundIndicator, OutboundIndicator } from "../styles";
import CdnTime from "../layout/CdnTime";
import { useContext } from "preact/hooks";
import { AppState } from "../app";

const Article = ({
  routeOverride,
  useTime = true,
}: {
  routeOverride?: string;
  useTime: boolean;
}) => {
  const route = useRoute();
  const id = route.params["id"];
  const state = useContext(AppState);
  const metadata = state.currentMetadata.value;
  const frontmatter = metadata?.frontmatter;
  const timestamp = frontmatter
    ? html`
        <${CdnTime}
          inline=${false}
          frontmatter=${frontmatter}
        />
      `
    : "";

  const signal = useSignal("loading...");
  useSignalEffect(() => {
    fetch(routeOverride ?? `/static/articles/${id}/index.html`).then((resp) => {
      resp.text().then((text) => {
        signal.value = text;
        const target = document.querySelector("#target")!;
        target.innerHTML = signal.value;
        target
          .querySelectorAll("a[href^='#']")
          .forEach((item) => (item.className += InboundIndicator));
        target
          .querySelectorAll("a[href^='https://']")
          .forEach((item) => (item.className += OutboundIndicator));
      });
    });
  });

  return html`
    ${useTime ? timestamp : ""}
    <div id="target">loading...</div>
  `;
};

export default Article;
