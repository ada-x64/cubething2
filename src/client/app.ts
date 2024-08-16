import {LitElement, PropertyValues, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Router} from '@vaadin/router'

// this is required so esbuild doesn't ignore the 'unused' dependency
import('./views/home.js')
import('./views/article.js')

@customElement('the-app')
class App extends LitElement {
    
    async firstUpdated(_changedProperties: PropertyValues): Promise<void> {
        super.firstUpdated(_changedProperties)
        const router = new Router(this.shadowRoot?.querySelector('#outlet'))
        await router.setRoutes([
            {path: '/', component: 'view-home'},
            {path: '/:fileName', component: 'view-article', action: async (ctx) => {
                const module = await import('./views/article.js')
                const el = new module.default(ctx.params['fileName'] as string)
                return el
            }},
            {path: '(.*)', redirect: '/'}
        ])
    }

    render() {
        return html`<main id="outlet">
            <a href="/articles/creating-this-site">link</a>
        </main>`
    }
}

declare global {
  interface HTMLElementTagNameMap {
    "the-app": App;
  }
}