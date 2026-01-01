import { LitElement, html, css } from 'lit'
import { Routes, Router } from '@lit-labs/router'

import './home-page.mjs'
import './contacts-page.mjs'
import './kanban-page.mjs'

class MyApp extends LitElement {

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        #content {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
    `

    constructor () {
        super()
        this.router = new Router(this, [
            {path: '/', render: () => html`<home-page></home-page>`},
            {path: '/contacts', render: () => html`<contacts-page></contacts-page>`},
            {path: '/kanban', render: () => html`<kanban-page></kanban-page>`},
        ])
    }

    render () {
        return html`

            <!-- Pages content -->
            <div id="content">
                ${this.router.outlet()  }
            </div>
        `
    }

}

customElements.define('my-app', MyApp)