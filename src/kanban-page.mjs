import { LitElement, html, css } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

import './user-form.mjs'

export class KanbanPage extends LitElement {

    static styles = css`
        :host {
            display: block;
            padding: 16px;

            --border-color: #e5e7eb;
            --primary-color: #3b82f6;
            --text-color: #374151;
        }

        h1 a {
            text-decoration: none;
            color: var(--primary-color);
        }

        .container {
            display: flex;
            gap: 0.5rem;
        }

        .task-column {
            margin: 1rem;
            padding: 1rem;
            padding-bottom: 4.1rem;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            flex: 1;
        }

        .task-column h2 {
            text-align: center;
        }

        .tasks {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            list-style: none;
            padding: 0;
        }

        .task {
            padding: 1rem;
            border: 1px solid #eee;
            border-radius: 0.5rem;
            background-color: #f9f9f9;
            cursor: grab;

            position: relative;
        }

        .task:active {
            cursor: grabbing;
        }

        #dragged-task {
            opacity: 0.3;
            background-color: rgba(154, 205, 50, 0.3);
        }

        .li-name {
            margin: 0;
        }

        .li-msgCount {
            margin: 0;
            position: absolute;
            top: -0.5rem;
            right: -0.5rem;
            background-color: salmon;
            color: white;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }

        /* dialog h2 {
            text-align: center;
        } */

        dialog {
            display: none;
        }

        dialog[open] {
            padding: 3rem;
            width: 750px;
            max-width: 90%;
            display: flex;
            border: 2px solid var(--main-color);
            border-radius: 3rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* dialog backdrop */
        dialog::backdrop {
            background-color: rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 600px) {
            .container {
                flex-direction: column;
            }

            dialog {
                width: 90%;
                height: auto;
            }
        }

    `

    static properties = {
        items: {
            type: Array,
            state: true
        }
    }

    constructor () {
        super ()
        this.items = []
        this.jsonFileURL = 'http://localhost:3000/api/kanban'
    }

    firstUpdated () {
        super.firstUpdated()
        this.loadContacts()
    }

    async loadContacts () {
        try {
            const response = await fetch(this.jsonFileURL)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            this.items = data
        } catch (error) {
            console.error('Error loading contacts:', error)
        }
    }

    onDragOver (event) {

        if (event.dataTransfer.types.includes('task')) {
            event.preventDefault()
        }
    }

    onDragStart (event) {
        // the only effect allowed is move
        event.dataTransfer.effectAllowed = 'move'
        const taskId = event.target.dataset.task
        const clientId = event.target.dataset.id

        // set the id to identify the dragged element
        event.target.id = 'dragged-task'

        console.log(`@DRAG_START (${taskId}, ${clientId})`)

        // custom type to identify a task drag
        event.dataTransfer.setData('task', taskId)
        event.dataTransfer.setData('client', clientId)
    }

    onDragEnd (event) {
        // remove the id from the dragged element
        event.target.id = ''
    }

    onDrop (event) {
        event.preventDefault()

        console.log(`@DROP event on ${event.target}`)

        if (event.target !== event.currentTarget) {
            console.log('@DROP aborted: event target is not the currentTarget')
            return
        }

        const taskId = event.dataTransfer.getData('task')
        const clientId = event.dataTransfer.getData('client')
        const draggedElement =
            this.renderRoot.querySelector('#dragged-task')

        draggedElement.remove()
        event.target.querySelector('.tasks').appendChild(draggedElement)

        console.log(`@DROP ${event.target.dataset.task}(${taskId}, ${clientId})`)
    }

    onClick (event) {

        const utente = event.currentTarget.utente
        const message = event.currentTarget.message

        const dialog = this.renderRoot.querySelector('dialog')
        const userForm = dialog.querySelector('user-form')

        userForm.user = utente
        userForm.message = message

        dialog.showModal()
        dialog.addEventListener('close', () => {
            userForm.user = null
        })

    }

    render () {
        return html`

            <h1><a href="/">H</a> / Kanban</h1>

            <div class="container">

                ${repeat(
                    this.items,
                    (task) => task.taskId,
                    (task, index) => html`
                        <div class="task-column"
                            data-task=${task.taskId}
                            @dragover=${this.onDragOver}
                            @drop=${this.onDrop}>
                            <h2>${task.taskName}</h2>
                            <ul class="tasks">
                                ${repeat(
                                    task.tasks,
                                    (subtask) => subtask.id,
                                    (subtask, subindex) => html`
                                        <li
                                            class="task"
                                            .utente=${subtask}
                                            .message=${task.message}
                                            data-task=${subtask}
                                            data-id=${subtask.id}
                                            draggable="true"
                                            @click=${this.onClick}
                                            @dragstart=${this.onDragStart}
                                            @dragend=${this.onDragEnd}>
                                            <p class="li-name">${subtask.name}</p>
                                            <p class="li-msgCount">${subtask.msgCount}</p>
                                        </li>
                                    `
                                )}
                            </ul>
                        </div>
                    `
                )}

            </div>

            <dialog>
                <user-form></user-form>
            </dialog>
        `
    }

}

customElements.define('kanban-page', KanbanPage)