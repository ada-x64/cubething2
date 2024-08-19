import marked from "../marked.js";

import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("view-article")
export default class ViewArticle extends LitElement {
	@property({ type: String })
	route: string;

	@state()
	private loading = true;
	@state()
	private text = "";

	constructor(route: string) {
		super();
		this.route = route;
		// TODO: Use @lit/task
		fetch(`${this.route}.md`).then((res) =>
			res.text().then((text) =>
				marked(text, { async: true }).then((text) => {
					this.text = text;
					this.loading = false;
				}),
			),
		);
	}

	render() {
		return html`<article id="article"></article>`;
	}
}
declare global {
	interface HTMLElementTagNameMap {
		"view-article": ViewArticle;
	}
}
