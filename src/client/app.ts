import {LitElement, css, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('the-app')
class App extends LitElement {
    render() {
        return html`<p>get lit</p>`
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "the-app": App;
  }
}