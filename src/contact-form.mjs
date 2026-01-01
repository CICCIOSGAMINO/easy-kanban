import { LitElement, html, css } from 'lit'

/**
 * Form is used for add/edit contact in the contacts page
 */
export class ContactForm extends LitElement {

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
        }
    }

    constructor () {
        super()
        this.user = null
    }

    render () {
        return html`
            <form method="dialog">

                <div class="two-columns">

                    <!-- <h2>${this.user?.name} - ${this.user?.id}</h2> -->

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

                </div>
                
            </form>
        `
    }
}

customElements.define('contact-form', ContactForm)