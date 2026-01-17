import { LitElement, html, css } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { classMap } from 'lit/directives/class-map.js'
import { sharedStyles } from './shared-styles.mjs'
import {
    deleteIcon,
    contactLensesIcon,
    glassesIcon
} from './mySVG.mjs'

import {
    deleteContactFromKanbanOnServer,
    updateTaskPositionOnServer
} from './server-api.mjs'

import './user-form.mjs'

export class KanbanPage extends LitElement {

    static styles = [
        sharedStyles,
        css`
        :host {
            display: block;
            padding: 16px;
        }

        .task-column {
            margin: 1rem;
            padding: 1rem;
            padding-bottom: 4.1rem;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
            flex: 1;

            position: relative;
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

        .container {
            display: flex;
            gap: 0.5rem;
            flex-direction: column;
        }

        .delete-zone {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            width: 5rem;
            height: 5rem;
            border: 2px dashed var(--main-color);
            border-radius: 50%;
            display: grid;
            place-items: center;
            background-color: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

            cursor: pointer;
        }

        .delete-zone svg {
           pointer-events: none;
        }

        .delete-zone:hover {
            border: 2px dashed crimson;
        }

        .delete-zone:hover svg {
            fill: red;
        }

        .delete-zone.drag-over {
            border: 2px dashed crimson;
        }

        .delete-zone.drag-over svg {
            fill: red;
            pointer-events: none;
        }

        .no-product {
            background-color: rgba(255, 215, 0, 0.2);
        }

        .in-delay {
            border: 2px solid red;
        }

        .eye-container {
            position: absolute;
            top: 1rem;
            right: 1.3rem;

            display: grid;
            grid-template-columns: auto auto;
            place-items: center;
        }

        .timing-txt {
            font-size: 0.9rem;
            color: gray;

            position: absolute;
            top: -2.3rem;
            transform: translateX(-25%);
        }

        #glasses-title {
            visibility: hidden;
        }

        #eyeBtn {

            > svg {
                width: 36px;
                height: 36px;
            }
        }

        @media (min-width: 600px) {
            .container {
                flex-direction: row;
            }

            #glasses-title {
                visibility: visible;
            }
        }

    `]

    static properties = {
        items: {
            type: Array,
            state: true
        },
        isGlassesOn: {
            type: Boolean,
            state: true
        }
    }

    constructor () {
        super ()
        this.items = []
        // load default file for glasses
        this.jsonFileURL = '/api/kanban/glasses'

        this.isGlassesOn = true
    }

    connectedCallback () {
        super.connectedCallback()

        this.addEventListener('close-dialog', () => {
            const dialog = this.renderRoot.querySelector('dialog')
            dialog.close()

            this.requestUpdate()
        })
    }

    firstUpdated () {
        super.firstUpdated()
        this.loadKanban()

        const dropZone = this.renderRoot.querySelector('#deleteDiv')
        if (dropZone) {
            dropZone.addEventListener('dragenter', () => {
                dropZone.classList.add('drag-over')
            })

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over')
            })
        }
    }

    async loadKanban () {
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

        if (event.target !== event.currentTarget) {
            console.log('@DROP aborted: event target is not the currentTarget')
            return
        }

        const newPosition = event.currentTarget.dataset.task
        const clientId = event.dataTransfer.getData('client')

        const draggedElement =
            this.renderRoot.querySelector('#dragged-task')

        // move in the items array new position
        this.items = this.items.map((task) => {

            // remove from old position
            task.tasks = task.tasks.filter(
                (subtask) => subtask.id !== draggedElement.utente.id
            )

            
            if (task.taskId === Number(newPosition)) {
                // add to new position
                task.tasks.push(draggedElement.utente)   
            }

            return task
        })

        updateTaskPositionOnServer(
            clientId,
            newPosition,
            this.isGlassesOn ? 'glasses' : 'lenses'
        )
    }

    onDropDelete (event) {
        event.preventDefault()

        const clientId = event.dataTransfer.getData('client')
        deleteContactFromKanbanOnServer(
            clientId,
            this.isGlassesOn ? 'glasses' : 'lenses'
        )

        const draggedElement =
            this.renderRoot.querySelector('#dragged-task')

        draggedElement.remove()

        // @DEBUG
        // console.log(`@DROP_CLIENT_ID (${clientId})`)
    }

    onClick (event) {

        const utente = event.currentTarget.utente
        const message = event.currentTarget.message

        const dialog = this.renderRoot.querySelector('dialog')
        const userForm = dialog.querySelector('user-form')

        userForm.user = utente
        userForm.message = message
        userForm.isGlassesOn = this.isGlassesOn
        
        dialog.showModal()
    }

    isInDelay (since, timing) {
        return new Date(since).getTime() + timing * 24 * 60 * 60 * 1000 < new Date().getTime()
    }

    onEyeClick () {

        this.isGlassesOn = !this.isGlassesOn

        if (this.isGlassesOn) {
            this.jsonFileURL = '/api/kanban/glasses'  // load default file for glasses
        } else {
            this.jsonFileURL = '/api/kanban/lenses'
        }

        this.loadKanban()
    }

    render () {

        return html`

            <h1>
                <a href="/">H</a> / Kanban
            </h1>

            <div class="eye-container">
                <h1 id="glasses-title">${this.isGlassesOn ? 'Occhiali' : 'Lenti'} / </h1>
                <button
                    id="eyeBtn"
                    class="eye-icon"
                    @click=${this.onEyeClick}>
                    ${this.isGlassesOn ? glassesIcon : contactLensesIcon}
                </button>
            </div>
            

            <div
                id="deleteDiv"
                class="delete-zone"
                @dragover=${this.onDragOver}
                @drop=${this.onDropDelete}>
                ${deleteIcon}
            </div>

            <div class="container">

                ${repeat(
                    this.items,
                    (task, index) => html`
                        <div class="task-column"
                            data-task=${task.taskId}
                            @dragover=${this.onDragOver}
                            @drop=${this.onDrop}>

                            <p class="timing-txt">${task.timingTxt}</p>

                            <h2>${task.taskName}</h2>

                            <ul class="tasks">
                                ${repeat(
                                    task.tasks,
                                    (subtask, subindex) => html`
                                        <li
                                            class="${classMap({
                                                'task': true,
                                                'no-product': subtask.product === undefined,
                                                'in-delay': this.isInDelay(subtask?.since, task?.timing)
                                            })}"
                                            .utente=${subtask}
                                            .task=${task.taskId}
                                            data-task=${task.taskId}
                                            data-id=${subtask.id}
                                            .message=${task.message}
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