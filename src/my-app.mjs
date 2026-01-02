import { LitElement, html, css } from 'lit'
import { Routes, Router } from '@lit-labs/router'

import '@cicciosgamino/snack-bar'

import './home-page.mjs'
import './contacts-page.mjs'
import './kanban-page.mjs'

class MyApp extends LitElement {

    static styles = css`
        :host {
            display: block;
            position: relative;
        }

        snack-bar {
            --snack-font-size: 1.5rem;
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

    connectedCallback () {
        super.connectedCallback()

        this.addEventListener('snackbar-message', (e) => {
            const snackBar = this.renderRoot.querySelector('snack-bar')
            snackBar.show(
                e.detail.message,
                2700,
                e.detail.bkColor,
                e.detail.txtColor
            )
        })
    }

    render () {
        return html`

            <!-- Pages content -->
            <div id="content">
                ${this.router.outlet()  }
            </div>
            <snack-bar timing="2700"></snack-bar>
        `
    }

}

customElements.define('my-app', MyApp)