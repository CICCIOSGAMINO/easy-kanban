import { LitElement, html, css } from 'lit'
import { sharedStyles } from './shared-styles.mjs'

import './avatar-picker.mjs'

const cancelContact = new CustomEvent('cancel-contact', {
    bubbles: true,
    composed: true,
})

const modifyContact = (user) => new CustomEvent('modify-contact', {
    detail: { user },
    bubbles: true,
    composed: true,
})

const newContact = (user) => new CustomEvent('new-contact', {
    detail: { user },
    bubbles: true,
    composed: true,
})

/**
 * Form is used for add/edit contact in the contacts page
 */
export class ContactForm extends LitElement {

    static styles = [
        sharedStyles,
        css`
        :host {
            display: block;
            padding: 1.5rem;
        }

        form {
            display: grid;
            gap: 1rem;
            align-items: start;
        }

        .two-columns {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0;
        }

        .field {
            margin-top: 3rem;
            position: relative;
        }

        label {
            font-size: 17px;
            position: absolute;
            top: 9px;
            left: 9px;
            transition: top .2s ease-in-out, font-size .2s ease-in-out;
        }

        label.active {
            top: -1.3rem;
            color: var(--main-color);
            font-size: 13px;
        }

        input {
            width: 100%;
            padding: 0.5rem;
            font-size: 1rem;
            border: none;
            border-bottom: 2px solid var(--main-color);
            outline: none;
            transition: border-color 0.3s;
        }

        /* ---------------------------- valid / invalid ---------------------- */
        /* handle invalid field when not :focus
            (set the placeholder " " on input field) */
        input:not(:focus):not(:placeholder-shown):invalid {
            border-bottom: 2px solid crimson;
            color: crimson;
        }

        /* handle the label of not :focus invalid label's input */
        input:not(:focus):not(:placeholder-shown):invalid + label {
            color: crimson;
        }

        @media (min-width: 600px) {
            .two-columns {
                grid-template-columns: 1fr 1fr;
                gap: 5rem;
            }
        }

    `]  

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

    updated (changedProperties) {
        if (changedProperties.has('user') && this.user) {
            this.fillForm(this.user)
        }
    }
    
    onFocusIn (e) {
        const label = this.renderRoot.querySelector(`label[for=${e.target.id}]`)
        label.classList.add('active')
    }

    onFocusOut (e) {
        if (!e.target.value) {
            const label = this.renderRoot.querySelector(`label[for=${e.target.id}]`)
            label.classList.remove('active')
        }
    }

    fillForm (user) {

        this.renderRoot.querySelectorAll('input').forEach((input) => {
            const label = this.renderRoot.querySelector(`label[for=${input.id}]`)
            if (user[input.name]) {
                input.value = user[input.name]
                label.classList.add('active')
            } else {
                input.value = ''
                label.classList.remove('active')
            }
        })
    }

    saveForm (e) {
        e.preventDefault()

        // check validity
        const form = e.target.closest('form')
        if (!form.checkValidity()) {
            form.reportValidity()
            return
        }   

        const formData = new FormData(e.target.closest('form'))
        const contactData = {
            id: this.user?.id || null,
            avatar:  this.renderRoot.querySelector('avatar-picker').getAttribute('selected-avatar'),
            name: formData.get('name'),
            product: formData.get('product'),
            email: formData.get('email'),
            phone: formData.get('phone'),
        }

        if (this.user?.id) {
            this.dispatchEvent(modifyContact(contactData))
        } else {
            this.dispatchEvent(newContact(contactData))
        }
        

        // clear the form
        form.reset()
    }

    cancelForm (e) {
        e.preventDefault()

        this.dispatchEvent(cancelContact)
    }

    render () {
        return html`
            <form method="dialog">

                <avatar-picker .selectedAvatar=${this.user?.avatar}></avatar-picker>

                <div class="two-columns">

                    <!-- <h2>${this.user?.name} - ${this.user?.id}</h2> -->
                     <div>
                        <div class="field">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                size="29"
                                autocomplete="name"
                                placeholder=" "
                                required
                                .value=${this.user?.name}
                                @focusin=${this.onFocusIn}
                                @focusout=${this.onFocusOut}/>
                            <label for="name">Name</label>
                        </div>
                        <div class="field">
                            <input
                                id="product"
                                name="product"
                                type="text"
                                size="29"
                                placeholder=" "
                                required
                                .value=${this.user?.product}
                                @focusin=${this.onFocusIn}
                                @focusout=${this.onFocusOut}/>
                            <label for="product">Product</label>
                        </div>
                     </div>
                     <div>
                        <div class="field">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                size="29"
                                autocomplete="email"
                                placeholder=" "
                                required
                                .value=${this.user?.email}
                                @focusin=${this.onFocusIn}
                                @focusout=${this.onFocusOut}/>
                            <label for="email">eMail</label>
                        </div>
                        <div class="field">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                size="29"
                                autocomplete="tel"
                                placeholder=" "
                                required
                                .value=${this.user?.phone}
                                @focusin=${this.onFocusIn}
                                @focusout=${this.onFocusOut}/>
                            <label for="phone">Phone</label>
                        </div>
                    </div>
                </div>

                <div class="buttons">
                    <button
                        value="cancel"
                        @click=${this.cancelForm}>
                        Cancel
                    </button>
                    <button
                        class="save-btn"
                        value="close"
                        @click=${this.saveForm}>
                        Save
                    </button>

                </div>
                
            </form>
        `
    }
}

customElements.define('contact-form', ContactForm)