/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import Template from "./template";
import { useRoute } from "preact-iso";
import { useSignal, useSignalEffect } from "@preact/signals";

const Article = () => {
  const route = useRoute();
  const id = route.params["id"];
  const signal = useSignal("loading...");
  useSignalEffect(() => {
    fetch(`/static/articles/${id}`).then((resp) => {
      resp.text().then((text) => (signal.value = text.replaceAll("\n", "")));
    });
  });

  const res = html` <${Template}>
    <article dangerouslySetInnerHTML=${{ __html: signal.value }}></article>
  <//>`;
  console.log({ id, signal, res });
  return res;
};

export default Article;
