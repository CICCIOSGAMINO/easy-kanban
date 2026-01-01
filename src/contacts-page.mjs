import { LitElement, html, css } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

import { addIcon, deleteIcon, saveIcon } from './mySVG.mjs'
import { allAvatars, avatarSVGs } from './avatars.mjs'

import {
    addContactToKanbanOnServer,
    deleteContactsOnServer
} from './server-api.mjs'

import './contact-form.mjs'

export class ContactsPage extends LitElement {

    static styles = css`
        :host {
            display: block;
            padding: 16px;

            --border-color: #e5e7eb;
            --primary-color: #3b82f6;
            --text-color: #374151;
        }

        button {
            margin: .5rem;
            padding: .8rem 1.7rem;
            font-size: 1rem;
            background-color: white;
            border: 2px solid var(--primary-color);
            border-radius: 2.1rem;
            cursor: pointer;
        }

        h1 a {
            text-decoration: none;
            color: var(--primary-color);
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
            grid-template-columns: repeat(3, minmax(100px, 1fr));
            padding: .5rem;
            border-bottom: 1px solid var(--border-color);
            align-items: center;

            cursor: pointer;
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

        .add-icon, .delete-icon {
            background: none;
            border: none;
            cursor: pointer;
            padding: .3rem;
        }

        .add-icon:hover svg {
            fill: salmon;
        }

        .delete-icon:hover svg {
            fill: red;
        }

        .add-icon svg, .delete-icon svg {
            width: 27px;
            height: 27px;
            fill: var(--primary-color);
        }


        @media (min-width: 600px) {
            
        }
    `

    static properties = {
        contacts: {
            type: Array
        }
    }

    constructor () {
        super()

        this.contacts = []
        this.jsonFileURL = 'http://localhost:3000/api/clients'
    }

    firstUpdated () {
        this.loadContacts()

        console.log(allAvatars[3% allAvatars.length])
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
            since: '',
            lastContact: '',
            product: '',
            msgCount: 0,
            avatar: allAvatars[Math.floor(Math.random() * allAvatars.length)],
        }
        dialog.showModal()
    }

    deleteContact (id) {
        if (confirm(`Are you sure you want to delete contact with id: ${id}?`)) {
            this.contacts = this.contacts.filter(contact => contact.id !== id)

            deleteContactsOnServer(this.contacts)
        }
        
    }

    addContact (id) {
        addContactToKanbanOnServer(id)
    }

    render () {
        return html`

            <h1><a href="/">H</a> / Clients</h1>

            <!-- <button @click=${this.loadContacts}>Load</button> -->
            <button @click=${() => this.sort(1)}>Sort</button>
            <button
                class="add-icon"
                @click=${this.openAddContactDialog}>
                ${addIcon}
            </button>
            <!-- <button @click=${() => this.sort(-1)}>Sort descending</button> -->
            
            <div class="container">

                ${repeat(
                    this.contacts,
                    (contact) => contact.id,
                    (contact, index) => html`
                        <div draggable="true" class="field-row">
                            <div class="user-info">
                                <div class="avatar">
                                    ${ unsafeSVG(avatarSVGs[contact.avatar])}
                                </div>
                                <div class="user-details">
                                    <p>${contact.name}</p>
                                    <p>${contact.id}</p>
                                </div>
                            </div>
                            <div class="contact-details">
                                <div>${contact.phone}</div>
                                <div>${contact.email}</div>
                            </div>
                            
                            <div>
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

            <dialog>
                <contact-form></contact-form>
            </dialog>
        `
    }
}

customElements.define('contacts-page', ContactsPage)