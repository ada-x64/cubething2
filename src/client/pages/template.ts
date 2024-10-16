/////////////////////////////// cubething.dev /////////////////////////////////

import { html } from "htm/preact/index.js";
import Sidebars from "../sidebars";
import type { FunctionComponent } from "preact";

const Template: FunctionComponent = (props) => {
  const res = html`
    <${Sidebars} />
    ${props.children}
  `;
  console.log("TEMPLATE:", { res });
  return res;
};

export default Template;
