import { LitElement, html, css} from 'lit'

export class AvatarPicker extends LitElement {

    static styles = css`
        :host {
            display: block;
        }

        .avatar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
            gap: 1rem;
        }
    `

    static properties = {
        selectedId: {
            type: String,
            attribute: 'selected-id'
        }
    }

    constructor () {
        super()
        this.selectedId = 0
    }
}

customElements.define('avatar-picker', AvatarPicker)