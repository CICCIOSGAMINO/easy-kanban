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

    /* Input / Label */
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