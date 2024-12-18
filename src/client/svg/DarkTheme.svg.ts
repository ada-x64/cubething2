/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";

export default function f({ size }: { size?: string | number }) {
  return html`
    <svg
      width=${size ?? "1em"}
      height=${size ?? "1em"}
      viewBox="0 0 100 100"
      version="1.1"
      id="svg5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs id="defs2" />
      <g id="layer1">
        <path
          id="path394"
          d="M 50.304876,0.98337637 A 49.321501,49.016624 0 0 0 0.98337493,50 49.321501,49.016624 0 0 0 50.304876,99.016626 49.321501,49.016624 0 0 0 71.222202,94.354301 44.389351,45.340377 0 0 1 35.508426,50 44.389351,45.340377 0 0 1 71.258808,5.6361262 49.321501,49.016624 0 0 0 50.304876,0.98337637 Z"
        />
      </g>
    </svg>
  `;
}
