import { LitElement, html, css} from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { sharedStyles } from './shared-styles.mjs'

import {
    eyeToolSVGs,
    allEyeTools
} from './glass-lens.mjs'

export class GlassLensPicker extends LitElement {

    static styles = [
        sharedStyles,
        css`
        :host {
            display: block;
        }

        .eye-tool-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(40px, 1fr));
            gap: .7rem;
        }

        .eye-tool {
            display: grid;
            place-items: center;

            cursor: pointer;
        }

        .eye-tool svg {
            width: 91px;
            height: 91px;
        }
        
        .eye-tool[selected] {
            box-sizing: border-box;
            border: 3px solid var(--main-color);
            border-radius: 50%;
            padding: .3rem;
        }

        @media (min-width: 600px) {

            .eye-tool-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(80px, 1fr));
                gap: 2.1rem;
            }

        }
    `]

    static properties = {
        selectedEyeTool: {
            type: String,
            attribute: 'selected-eye-tool',
            reflect: true
        }
    }

    constructor () {
        super()
        
    }

    firstUpdated () {
        this.selectedEyeTool = "glasses"
    }

    resetSelection () {
        this.selectedEyeTool = 'glasses'
    }

    render () {
        return html`
            <div class="eye-tool-grid">
                ${allEyeTools.map(eyeId => html`
                    <div 
                        class="eye-tool"
                        ?selected=${this.selectedEyeTool === eyeId}
                        @click=${() => this.selectEyeTool(eyeId)}>
                        ${unsafeSVG(eyeToolSVGs[eyeId])}
                    </div>
                `)}
            </div>
        `
    }

    selectEyeTool (eyeToolId) {
        this.selectedEyeTool = eyeToolId

    }
}

customElements.define('glass-lens-picker', GlassLensPicker)