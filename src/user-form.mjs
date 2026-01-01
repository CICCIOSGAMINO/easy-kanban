import { LitElement, html, css } from 'lit'

/**
 * Form is used for user details display and message sending
 */
export class UserForm extends LitElement {

    static styles = css`
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

        button {
            padding: 1rem 2rem;
            font-size: 1rem;
            background-color: white;
            color: var(--main-color);
            border: 2px solid var(--main-color);
            border-radius: 2.1rem;
            cursor: pointer;
        }

        @media (max-width: 600px) {

            dialog {
                width: 90%;
                height: auto;
            }
        }
    `

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

    sendMessage (e) {
        e.preventDefault()
        // console.log('Sending message to ', this.user.email)

        // whatsapp link
        const phone = this.user.phone.replace(/\D/g, '') // remove non-digit characters
        const text = encodeURIComponent(e.target.closest('form').querySelector('textarea').value)
        const wsUrl = `https://wa.me/${phone}?text=${text}`

        window.open(wsUrl, '_blank').focus()
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
                            <p class="value">${this.user?.product}</p>
                        </div>
                    </div>

                    <div>
                        <div class="field">
                            <p class="label">Msg Count</p>
                            <p class="value">${this.user?.msgCount}</p>
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
                    <button value="confirm" style="background-color: var(--main-color); color: white;">
                        Cancel
                    </button>
                </div>
                
            </form>
        `
    }
}

customElements.define('user-form', UserForm)