import { LitElement, html, css } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

import { addIcon, deleteIcon } from './mySVG.mjs'
import { allAvatars, avatarSVGs } from './avatars.mjs'
import { sharedStyles } from './shared-styles.mjs'

import {
    addContactOnServer,
    modifyContactOnServer,
    addContactToKanbanOnServer,
    deleteContactsOnServer
} from './server-api.mjs'

import './contact-form.mjs'
import './glass-lens-picker.mjs'

const snackBarEvent = new CustomEvent('snackbar-message', {
    detail: {
        message: '',
        bkColor: 'crimson',
        txtColor: 'whitesmoke',
    },
    bubbles: true,
    composed: true
})

export class ContactsPage extends LitElement {

    static styles = [
        sharedStyles,
        css`
        :host {
            display: block;
            padding: 16px;
        }

        .head-buttons {
            position: absolute;
            top: 1.7rem;
            right: calc(50% - 4rem);
            display: flex;
            gap: .5rem;
        }

        .container {
            margin: .5rem;
            padding: .5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            overflow-y: auto;
            overflow-x: auto;
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .field-row {
            display: grid;
            /* grid-template-columns: repeat(4, minmax(100px, 1fr)); */
            grid-template-columns: auto;
            grid-template-rows: auto auto auto;
            padding: .5rem;
            border-bottom: 1px solid var(--border-color);
            align-items: center;

            position: relative;
        }

        .field-row:hover {
            background-color: rgba(59, 130, 246, 0.1);
        }

        /* .field-row:nth-child(odd) {
            background-color: #f9fafb;
        } */

        .user-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1rem;

            cursor: pointer;
        }

        .avatar svg {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #f3f4f6;
        }
        
        .user-details p {
            margin: 0;
            color: var(--text-color);
        }

        .user-details p:nth-child(2) {
            margin-top: .5rem;
            font-size: .7rem;
            font-weight: 600;
        }

        .contact-details {
            display: flex;
            flex-direction: column;
            gap: .3rem;
            color: var(--text-color);
        }

        .contact-details div:nth-child(2) {
            font-size: .9rem;
            color: gray;
        }

        .contact-buttons {
            position: absolute;
            right: 1rem;
            top: 1rem;
            display: flex;
            gap: .5rem;
        }

        .user-general {
            margin-top: 1rem;
        }

        #glass-lens-dialog {
            min-width: 90%;
            height: 301px;

        }

        #contact-id {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
        }

        @media (min-width: 600px) {

            #glass-lens-dialog {
                min-width: 275px;
                max-width: 401px;
                max-height: 355px;
            }

            .field-row {
                grid-template-columns: 2fr 2fr 1fr auto;
                grid-template-rows: auto;
            }

            .user-general {
                margin-top: 0;
            }

            .contact-buttons {
                position: static;
            }
            
        }
    `]

    static properties = {
        contacts: {
            type: Array
        }
    }

    constructor () {
        super()

        this.contacts = []
        this.jsonFileURL = '/api/clients'
    }

    connectedCallback () {
        super.connectedCallback()

        this.addEventListener('new-contact', async (e) => {
            const newUser = e.detail.user

            // close the dialog
            const dialog = this.renderRoot.querySelector('dialog')
            dialog.close()

            await addContactOnServer(newUser)
            await this.loadContacts()
        })

        this.addEventListener('modify-contact', async (e) => {
            const contactDetails = e.detail.user

            // close the dialog
            const dialog = this.renderRoot.querySelector('dialog')
            dialog.close()

            await modifyContactOnServer(contactDetails)
            await this.loadContacts()
        })

        this.addEventListener('cancel-contact', () => {
            // close the dialog
            const dialog = this.renderRoot.querySelector('dialog')
            dialog.close()
        })
    }   

    firstUpdated () {
        this.loadContacts()
    }

    async loadContacts () {
        try {
            const response = await fetch(this.jsonFileURL)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            this.contacts = data
        } catch (error) {
            console.error('Error loading contacts:', error)
        }
    }

    sort (dir) {
        this.contacts = [
        ...this.contacts.sort((a, b) => a.name.localeCompare(b.name) * dir),
        ]
    }

    openAddContactDialog () {
        const dialog = this.renderRoot.querySelector('dialog')
        const contactForm = dialog.querySelector('contact-form')
        contactForm.user = {
            id: '',
            name: '',
            email: '',
            phone: '',
            avatar: 'bip',
        }
        dialog.showModal()
    }

    openContactDialog (e) {

        const contactId =
            e.currentTarget.dataset.index
        
        const dialog = this.renderRoot.querySelector('#contact-dialog')
        const contactForm = dialog.querySelector('contact-form')
        contactForm.user = { ...this.contacts[contactId] }
        dialog.showModal()
    }

    async  deleteContact (id) {
        if (confirm(`Are you sure you want to delete contact with id: ${id}?`)) {
            this.contacts = this.contacts.filter(contact => contact.id !== id)

            await deleteContactsOnServer(id)

            this.requestUpdate()
        }
        
    }

    async addContact (id) {

        const dialog = this.renderRoot.querySelector('#glass-lens-dialog')
        const glassLensPicker = dialog.querySelector('glass-lens-picker')
        const contactIdP = dialog.querySelector('#contact-id')

        contactIdP.textContent = `Id / ${id}`
        dialog.dataset.contact = id
        glassLensPicker.resetSelection()

        dialog.showModal()
    }

    cancelForm () {
        const dialog = this.renderRoot.querySelector('#glass-lens-dialog')
        dialog.close()
    }

    async saveForm () {
        const dialog = this.renderRoot.querySelector('#glass-lens-dialog')
        const glassLensPicker = dialog.querySelector('glass-lens-picker')

        const id = dialog.dataset.contact
        const type = glassLensPicker.selectedEyeTool

        await addContactToKanbanOnServer(id, type)

        snackBarEvent.detail.bkColor = 'rgba(121, 246, 148, 1.0)'
        snackBarEvent.detail.txtColor = 'whitesmoke'

        snackBarEvent.detail.message = `Contact Id: ${id} Type: ${type}`
        this.dispatchEvent(snackBarEvent)

        dialog.close()
    }

    render () {
        return html`

            <h1><a href="/">H</a> / Clients</h1>

            <div class="head-buttons">
                <button @click=${() => this.sort(1)}>Sort</button>
                <button
                    class="add-icon"
                    @click=${this.openAddContactDialog}>
                    ${addIcon}
                </button>
            </div>
            
            <!-- <button @click=${() => this.sort(-1)}>Sort descending</button> -->
            
            <div class="container">

                ${repeat(
                    this.contacts,
                    (contact) => contact.id,
                    (contact, index) => html`
                        <div
                            draggable="true"
                            class="field-row">
                            <div
                                class="user-info user-general"
                                data-index=${index}
                                @click=${this.openContactDialog}>
                                <div class="avatar">
                                    ${ unsafeSVG(avatarSVGs[contact.avatar])}
                                </div>
                                <div class="user-details">
                                    <p>${contact.name}</p>
                                    <p>${contact.id}</p>
                                </div>
                            </div>
                            <div class="contact-details user-general">
                                <div>${contact.phone}</div>
                                <div>${contact.email}</div>
                            </div>

                            <div class="contact-details user-general">
                                <div>Other:</div>
                                <div>${contact?.other}</div>
                            </div>
                            
                            <div class="contact-buttons">
                                <button
                                    class="add-icon"
                                    @click=${() => this.addContact(contact.id)}>
                                    ${addIcon}
                                </button>
                                <button
                                    class="delete-icon"
                                    @click=${() => this.deleteContact(contact.id)}>
                                    ${deleteIcon}
                                </button>
                            </div>
                        </div>
                    `
                )}

            </div>

            <dialog id="contact-dialog">
                <contact-form></contact-form>
            </dialog>

            <dialog id="glass-lens-dialog">
                <p id="contact-id"></p>
                <glass-lens-picker></glass-lens-picker>

                <div>
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
                
            </dialog>
        `
    }
}

customElements.define('contacts-page', ContactsPage)