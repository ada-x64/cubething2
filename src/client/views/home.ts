import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("view-home")
export default class ViewHome extends LitElement {
	render() {
		return html`home`;
	}
}
declare global {
	interface HTMLElementTagNameMap {
		"view-home": ViewHome;
	}
}
