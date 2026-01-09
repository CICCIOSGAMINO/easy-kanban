import { LitElement, html, css, svg } from 'lit'
import {
    myChart,
    myScrum,
    myProject,
    myDownload
} from './mySVG.mjs'

export class HomePage extends LitElement {

    static styles = css`
        :host {
            display: block;

            /* icon background color */
            --icon-bg-color: #6c63ff;
        }

        h1 {
            color: whitesmoke;
        }

        main {
            display: grid;
            grid-template-columns: 1fr;
            justify-items: center;
            height: 100vh;
            gap: 2rem;

            text-align: center;
            position: relative;
        }

        p {
            margin: 0;
        }

        #svg-container svg {
            max-width: 45vh;
        }

        #a-side {
            display: none;
        }

        #b-side {
            margin-top: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: start;
            gap: 1rem;
        }

        .box-icon {
            color: whitesmoke;
            width: 205px;
            height: 205px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid var(--icon-bg-color);
            border-radius: 0.7rem;
            font-size: 1.3rem;
            cursor: pointer;

            position: relative;

            > div > svg {
                width: 155px;
                height: 155px;
            }

            > p {
                position: absolute;
                bottom: 0.5rem;
                width: 100%;
                color: var(--icon-bg-color);
                text-align: center;
            }

            &:hover {
                border: 2px solid salmon;
                color: white;
            }

            &:hover > p {
                color: salmon;
            }
        }

        #bk-btn {
            position: absolute;
            bottom: 1.5rem;
            right: 1.5rem;
            background-color: white;
            border: none;
            cursor: pointer;

            > svg {
                width: 45px;
                height: 45px;
                fill: var(--icon-bg-color);
            }
        }

        @media (min-width: 600px) {
            main {
                grid-template-columns: 1fr 1fr;
            }

            #a-side {
                display: block;
                background-color: salmon;
                width: 100%;
            }

             #b-side {
                margin-top: 5rem;
                flex-direction: row;
                gap: 3rem;
            }

        }

    `

    onClick (event) {
        const page = event.currentTarget.dataset.page
        window.history.pushState({}, '', `/${page}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
    }

    downloadJSONasFile (data, filename) {
        const dataStr = JSON.stringify(data, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')

        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    async backupData () {

        try {
            const response = await fetch('/api/files-backup', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const { clients, kanban } = await response.json()

            if (clients) {
                this.downloadJSONasFile(
                    clients,
                    `clients_${new Date().toLocaleDateString('en-GB')}.json`
                )
            }

            setTimeout(() => {
                if (kanban) {
                    this.downloadJSONasFile(
                        kanban,
                        `kanban_${new Date().toLocaleDateString('en-GB')}.json`
                    )
                }
            }, 250)

            // @DEBUG
            // console.log('@BACKUP DATA >>', { clients, kanban })
        
        } catch (error) {

            // TODO fire an Event to show error in SnackBar
            console.error('Failed to backup data:', error)
        }




        // ----------------------------------------------------------

        const snackBarEvent = new CustomEvent('snackbar-message', {
            detail: {
                message: 'Backup started',
                bkColor: '#2af255',
                txtColor: 'whitesmoke'
            },
            bubbles: true,
            composed: true
        })

        this.dispatchEvent(snackBarEvent)
    }

    render () {
        return html`
            <main>

                <div id="a-side">
                    <h1>Easy Kanban</h1>
                    
                    <div id="svg-container">
                        ${myChart}
                    </div>
                    
                    <!-- version -->
                    <p>v0.19.0 - Jen 2026</p>
                </div>
                <div id="b-side">
                    <div
                        class="box-icon"
                        data-page="contacts"
                        @click=${this.onClick}>
                        <div>
                            ${myProject}
                        </div>
                        <p>Contacts</p>
                    </div>
                    <div
                        class="box-icon"
                        data-page="kanban"
                        @click=${this.onClick}>
                        <div>
                            ${myScrum}
                        </div>
                        <p>Tasks</p>
                    </div>
                    
                </div>

                <button
                    id="bk-btn"
                    @click=${this.backupData}>
                    ${myDownload}
                </button>
                
                
            </main>
            
        `
    }

}

customElements.define('home-page', HomePage)