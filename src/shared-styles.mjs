import { css } from 'lit'

export const sharedStyles = css`

    :host {
        --main-color: #3b82f6;
        --border-color: #e5e7eb;
        --text-color: #374151;
    }

    [hidden] {
        display: none !important;
    }

    h1 a {
        text-decoration: none;
        color: var(--main-color);
    }

    button {
        margin-right: .5rem;
        padding: .8rem 1.7rem;
        font-size: 1rem;
        background-color: white;
        border: 2px solid var(--main-color);
        border-radius: 2.1rem;
        cursor: pointer;
    }

    button:hover {
        background-color: var(--main-color);
        color: white;
    }

    .buttons {
        margin-top: 2rem;
    }

    .save-btn {
        background-color: var(--main-color);
        color: white;
        border: 2px solid var(--main-color);
    }

    .save-btn:hover {
        background-color: salmon;
        border: 2px solid crimson;
        color: whitesmoke;
    }

    dialog {
        display: none;
    }

    dialog[open] {
        padding: 1rem;
        max-width: 95%;
        display: grid;
        place-items: center;
        border: 2px solid var(--main-color);
        border-radius: 3rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    /* dialog backdrop */
    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.3);
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

    .add-icon:hover {
        background-color: rgba(255, 165, 0, 0.2);
    }

    .delete-icon:hover {
        background-color: rgba(255, 0, 0, 0.2);
    }

    .delete-icon:hover svg {
        fill: red;
    }

    .add-icon svg, .delete-icon svg {
        width: 27px;
        height: 27px;
        fill: var(--main-color);
    }

    @media (min-width: 600px) {

        dialog {
            width: 95%;
            height: auto;
        }

        dialog[open] {
            padding: 3rem;
            min-width: 401px;
            max-width: 751px;
            max-height: 455px;

        }
    }

    
`