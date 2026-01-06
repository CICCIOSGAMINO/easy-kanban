import { LitElement, html, css } from 'lit'
import { sharedStyles } from './shared-styles.mjs'

import { updateTaskDetailsOnServer } from './server-api.mjs'

const requestUpdateEvent = new CustomEvent(
    'request-update', {
        bubbles: true,
        composed: true,
})                   

/**
 * Form is used for user details display and message sending
 */
export class UserForm extends LitElement {

    static styles = [
        sharedStyles,
        css`
        :host {
            display: block;
        }

        form {
            display: grid;
            gap: 1rem;
            align-items: start;
        }

        .two-columns {
            display: flex;
            gap: 7rem;
        }

        .field {
            margin-bottom: 1rem;
        }

        .field textarea {
            margin-right: 3rem;
            padding: 1rem;
            box-sizing: border-box;
            width: 100%;
            font-size: 1rem;

            border-bottom: 2px solid rgba(0, 0, 0, 0.7);

        }

        .label {
            font-weight: bold;
            margin: 0;
        }

        .value {
            margin: 0.2rem 0 0 0;
        }

        .mini-button {
            margin: .1rem;
            padding: .3rem .4rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 0.3rem;
            background-color: #f0f0f0;
            cursor: pointer;
        }

        .mini-minus {
            margin-left: 1rem;
            padding: .3rem .5rem;
        }

        @media (max-width: 600px) {

            dialog {
                width: 90%;
                height: auto;
            }
        }
    `]

    static properties = {
        user: {
            type: Object,
            attribute: false,
            state: true,
        },
        message: { type: String },
    }

    constructor () {
        super()
        this.user = null
    }

    msgCountPlus (e) {
        e.preventDefault()
        this.user.msgCount += 1

        this.requestUpdate()
    }

    msgCountMinus (e) {
        e.preventDefault()
        if (this.user.msgCount > 0) {
            this.user.msgCount -= 1

            this.requestUpdate()
        }
    }

    sendMessage (e) {
        e.preventDefault()
        // console.log('Sending message to ', this.user.email)

        updateTaskDetailsOnServer(
            this.user.id,
            {
                lastContact: new Date().toLocaleDateString('en-GB'),
                msgCount: this.user.msgCount + 1
            }
        )

        // whatsapp link
        const phone = this.user.phone.replace(/\D/g, '') // remove non-digit characters
        const text = encodeURIComponent(e.target.closest('form').querySelector('textarea').value)
        const wsUrl = `https://wa.me/${phone}?text=${text}`

        window.open(wsUrl, '_blank').focus()
    }

    saveDetails (e) {
        // e.preventDefault()

        updateTaskDetailsOnServer(
            this.user.id,
            {
                product: this.user.product,
                msgCount: this.user.msgCount
            }
        )

        this.dispatchEvent(requestUpdateEvent)

    }

    render () {
        return html`
            <form method="dialog">
                <h2>${this.user?.name} - ${this.user?.id}</h2>

                <div class="two-columns">

                    <div>
                        <div class="field">
                            <p class="label">eMail</p>
                            <p class="value">${this.user?.email}</p>
                        </div>
                        <div class="field">
                            <p class="label">Phone</p>
                            <p class="value">${this.user?.phone}</p>
                        </div>
                        <div class="field">
                            <p class="label">Since</p>
                            <p class="value">${this.user?.since} / ${this.user?.lastContact}</p>
                        </div>
                        <div class="field">
                            <p class="label">Product</p>
                                ${this.user?.product === undefined ? 
                                    html`
                                        <input
                                            type="text"
                                            class="value"
                                            @change=${(e) => { this.user.product = e.target.value }} />
                                    ` : html`
                                    <p class="value">${this.user?.product}</p>
                                `}
                        </div>
                    </div>

                    <div>
                        <div class="field">
                            <p class="label">Msg Count</p>
                            <p class="value">${this.user?.msgCount}
                                <button
                                    class="mini-button mini-minus"
                                    @click=${this.msgCountMinus}>- </button>
                                <button
                                    class="mini-button mini-plus"
                                    @click=${this.msgCountPlus}>+</button>
                            </p>
                        </div>
                        <div class="field">
                            <p class="label">Message</p>
                            <textarea class="value" rows="4" cols="35" .value=${this?.message}></textarea>
                        </div>
                        <div class="field">
                            <button class="w-btn" @click=${this.sendMessage}>Send Message</button>
                        </div>
                    </div>
                </div>

                <div>
                    <button value="close">Close</button>
                    <button
                        class="save-btn"
                        @click=${this.saveDetails}>
                        Save
                    </button>
                </div>
                
            </form>
        `
    }
}

customElements.define('user-form', UserForm)