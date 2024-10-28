/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import { useRoute } from "preact-iso";
import { useSignal, useSignalEffect } from "@preact/signals";

const Article = () => {
  const route = useRoute();
  const id = route.params["id"];
  const signal = useSignal("loading...");
  useSignalEffect(() => {
    fetch(`/static/articles/${id}`).then((resp) => {
      resp.text().then((text) => (signal.value = text));
    });
  });

  return html`<article
    dangerouslySetInnerHTML=${{ __html: signal.value }}
  ></article>`;
};

export default Article;
