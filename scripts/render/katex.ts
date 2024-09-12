/////////////////////////////// cubething.dev /////////////////////////////////

import { readFileSync } from "fs";
import katex from "katex";
import type { KatexOptions } from "katex";

const katexOptions: KatexOptions = {
  trust: (context) => ["\\htmlId", "\\href"].includes(context.command),
  macros: {
    "\\eqref": "\\href{###1}{(\\text{#1})}",
    "\\ref": "\\href{###1}{\\text{#1}}",
    "\\label": "\\htmlId{#1}{}",
  },
};
// This should probably be replaced with a custom build script for make4ht
export default (htmlPath: string) => {
  // trim to inner content and properly link css
  let html = readFileSync(htmlPath).toString().replaceAll("&amp;", "&");

  // custom commands - todo : make this configurable
  const videxp = /\\video(?:\{(.+)\}){3}/gi;
  html.replaceAll(videxp, '<video src="#3" width=#1 height=#2 controls />');

  // replace display maths as appropriate
  const labelMap: string[] = [];
  const environs = "(?:" + ["align", "equation"].join("|") + ")";
  const environmentexp = String.raw`\\begin\{${environs}\}(?:(?!\\end).)+\\end\{${environs}\}`;
  const displayexp = String.raw`\\\[(?:(?!\\\]).)+\\\]`;
  const displayRegex = new RegExp(`(?:${environmentexp}|${displayexp})`, "gi");
  const res = html.match(displayRegex) ?? [];
  for (const val of res) {
    const trimmedVal = val.replace(/(?:\\\[|\\\])/gi, "");
    const labels = trimmedVal.matchAll(/\\label\s*\{((?:(?!\}).)+)\}/gi) ?? [];
    for (const label of labels) {
      labelMap.push(label?.[1]);
    }
    html = html.replace(
      val,
      katex.renderToString(trimmedVal, { ...katexOptions, displayMode: true }),
    );
  }
  // then do inline
  const inline = String.raw`\\\((?:(?!\\\)).)+\\\)`;
  const cmds = ["eqref", "ref", "label"];
  const cmdexp = String.raw`\\(?:${cmds.join("|")})\{(?:(?!\}).)+\}`;
  const inlineRegex = new RegExp(`(?:${inline}|${cmdexp})`, "gi");
  const res2 = html.match(inlineRegex) ?? [];
  for (const val of res2) {
    const trimmedVal = val.replace(/(?:\\\(|\\\))/gi, "");
    const cmdContent = trimmedVal.match(/\{((?:(?!\}).)+)\}/)?.[1];
    let rendered = katex.renderToString(trimmedVal, {
      ...katexOptions,
      displayMode: false,
    });
    if (cmdContent) {
      rendered = rendered.replaceAll(
        `>${cmdContent}<`,
        String.raw`>${labelMap.findIndex((val) => val === cmdContent) + 1}<`,
      );
    }
    html = html.replaceAll(val, rendered);
  }
  return html;
};
