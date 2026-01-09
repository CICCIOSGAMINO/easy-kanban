import { LitElement, html, css} from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { sharedStyles } from './shared-styles.mjs'

import {
    allAvatars,
    avatarSVGs 
} from './avatars.mjs'

export class AvatarPicker extends LitElement {

    static styles = [
        sharedStyles,
        css`
        :host {
            display: block;
        }

        .avatar-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(55px, 1fr));
            gap: .7rem;
        }

        .avatar {
            display: grid;
            place-items: center;

            cursor: pointer;

            > svg {
                width: 40px;
                height: 40px;
                /* border-radius: 50%;
                background-color: #f3f4f6; */
            }
        }
        
        .avatar[selected] {
            box-sizing: border-box;
            border: 3px solid var(--main-color);
            border-radius: 50%;
            padding: .3rem;
        }

        @media (min-width: 600px) {

            .avatar-grid {
                display: grid;
                grid-template-columns: repeat(5, minmax(80px, 1fr));
                gap: 2.1rem;
            }

            .avatar {

                > svg {
                    width: 75px;
                    height: 75px;
                }
            }

        }
    `]

    static properties = {
        selectedAvatar: {
            type: String,
            attribute: 'selected-avatar',
            reflect: true
        }
    }

    constructor () {
        super()
        
    }

    firstUpdated () {
        this.selectedAvatar = "bip"
    }

    resetSelection () {
        this.selectedAvatar = 'bip'
    }   

    render () {
        return html`
            <div class="avatar-grid">
                ${allAvatars.map(avatarId => html`
                    <div 
                        class="avatar"
                        ?selected=${this.selectedAvatar === avatarId}
                        @click=${() => this.selectAvatar(avatarId)}>
                        ${unsafeSVG(avatarSVGs[avatarId])}
                    </div>
                `)}
            </div>
        `
    }

    selectAvatar (avatarId) {
        this.selectedAvatar = avatarId

    }
}

customElements.define('avatar-picker', AvatarPicker)