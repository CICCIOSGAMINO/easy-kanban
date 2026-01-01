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
            margin-top: 5rem;
            display: flex;
            flex-direction: row;
            justify-content: start;
            gap: 3rem;
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
                width: 36px;
                height: 36px;
                fill: var(--icon-bg-color);
            }
        }

        @media (min-width: 768px) {
            main {
                grid-template-columns: 1fr 1fr;
            }

            #a-side {
                display: block;
                background-color: salmon;
                width: 100%;
            }
        }

    `

    onClick (event) {
        const page = event.currentTarget.dataset.page
        window.history.pushState({}, '', `/${page}`)
        window.dispatchEvent(new PopStateEvent('popstate'))
    }

    render () {
        return html`
            <main>

                <div id="a-side">
                    <h1>Easy Kanban</h1>
                    
                    <div id="svg-container">
                        ${myChart}
                    </div>
                    
                    <p>v1.0.0 - Jen 2026</p>
                </div>
                <div id="b-side">
                    <div @click=${this.onClick} class="box-icon" data-page="contacts">
                        <div>
                            ${myProject}
                        </div>
                        <p>Users</p>
                    </div>
                    <div @click=${this.onClick} class="box-icon" data-page="kanban">
                        <div>
                            ${myScrum}
                        </div>
                        <p>Tasks</p>
                    </div>
                    
                </div>

                <button id="bk-btn">
                    ${myDownload}
                </button>
                
                
            </main>
            
        `
    }

}

customElements.define('home-page', HomePage)