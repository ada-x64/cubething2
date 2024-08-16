import marked from '../marked.js'

import {LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('view-article')
export default class ViewArticle extends LitElement {
    @property({type: String})
    route: string

    constructor(route: string) {
        super()
        this.route = route
    }

    async render() {
        const raw = await (await fetch(`/static/${this.route}.md`)).text()
        return marked(raw)
    }
}
declare global {
  interface HTMLElementTagNameMap {
    "view-article": ViewArticle;
  }
}