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
        <circle
          id="path9264"
          cx="50"
          cy="50"
          r="49.019608"
        />
      </g>
    </svg>
  `;
}
