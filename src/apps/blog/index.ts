/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Bootstrap
import { bootstrap } from "./app";

const head = document.getElementsByTagName("head")[0]!;
head.innerHTML = `
    <link rel="stylesheet" href="/static/styles/index.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.15/dist/katex.min.css" integrity="sha384-Htz9HMhiwV8GuQ28Xr9pEs1B4qJiYu/nYLLwlDklR53QibDfmQzi7rYxXhMH/5/u" crossorigin="anonymous">
    <link rel="preload" href="/static/font/Chillax-Regular.otf" as="font" type="font/otf" crossorigin/>
    <link rel="preload" href="/static/font/Synonym-Regular.otf" as="font" type="font/otf" crossorigin/>
`;

bootstrap();

const body = document.getElementsByTagName("body")[0]!;
body.innerHTML = `<ct-app></ct-app>`;
