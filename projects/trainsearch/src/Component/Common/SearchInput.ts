import {css, html, LitElement, nothing} from "lit";
import {customElement, property, query, state} from "lit/decorators.js";

interface SearchSuggestEventInit extends EventInit {
    value: string
}

export class SearchSuggestEvent extends Event {
    public value: string

    constructor(type: string, eventInitDict: SearchSuggestEventInit) {
        super(type, eventInitDict);
        this.value = eventInitDict.value
    }
}

interface SearchChangeEventInit<T> extends EventInit {
    id: string
    value: T
}

export class SearchChangeEvent<T> extends Event {
    public id: string
    public value: T

    constructor(type: string, eventInitDict: SearchChangeEventInit<T>) {
        super(type, eventInitDict);
        this.id = eventInitDict.id
        this.value = eventInitDict.value
    }
}


export interface SearchSuggestion<T> {
    id: string,
    name: string,
    value: T
}

@customElement('ts-search-input')
class SearchInput<T> extends LitElement {
    @property({type: String})
    public value: string = ''

    @property({type: String})
    public placeholder: string = ''

    @property({type: Array})
    public suggestions: SearchSuggestion<T>[] = [];

    @query('input')
    private input!: HTMLInputElement

    @state()
    private focused: boolean = false

    static styles = css`
        :host {
            position: relative;
            display: flex;
        }

        div {
            display: flex;
            gap: 1px;
            flex-direction: column;
            position: absolute;
            font-size: 1rem;
            max-height: 50vh;
            overflow: auto;
            z-index: 1;
            left: 0;
            top: calc(100% + .5rem);
            border-radius: .25rem;
            background: #a2a2a2;
            color: #fff;
        }

        input {
            flex-grow: 1;
            padding: .5rem;
            border-top-left-radius: .25rem;
            border-bottom-left-radius: .25rem;
            font-size: 1rem;
            background: #2a2a2a;
            color: #fff;
            border: none;
        }

        input ~ button {
            border-top-right-radius: .25rem;
            border-bottom-right-radius: .25rem;
        }

        input:focus ~ button {
            z-index: -1;
        }

        button {
            border: none;
            margin: 0;
            padding: .5rem;
            background: #2a2a2a;
            color: #fff;
            font-size: 1rem;
        }

        button:hover {
            background: #0c0c0c;
        }

        small {
            color: var(--grey)
        }
    `

    onclick = (e: Event) => e.stopPropagation()

    private onOutsideClick = () => this.focused = false

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('click', this.onOutsideClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('click', this.onOutsideClick)
    }

    protected render() {
        return html`
            <input type="text"
                   .placeholder="${this.placeholder}"
                   .value="${this.value}"
                   @focus="${() => this.focused = true}"
                   @input="${this.changeKeyword}">
            <button @click="${this.onDelete}">&#9003;</button>
            ${this.renderSuggestions()}
        `;
    }


    private onDelete() {
        if (this.input) {
            this.input.value = ''
        }
        this.changeKeyword()
    }

    private renderSuggestions() {
        if (this.focused && this.suggestions && this.suggestions.length) {
            const suggestions = [];

            for (const suggestion of this.suggestions) {
                suggestions.push(html`
                    <button @click="${() => this.clickSuggestion(suggestion)}">${suggestion.name}</button>`)
            }

            return html`
                <div>${suggestions}</div>`;
        }

        return nothing;
    }

    private changeKeyword() {
        this.value = this.input?.value ?? ''
        this.dispatchEvent(new SearchSuggestEvent(
                'suggest',
                {composed: true, bubbles: true, value: this.input?.value ?? ''}
        ))
    }

    private clickSuggestion(suggestion: SearchSuggestion<T>) {
        this.dispatchEvent(new SearchChangeEvent<T>(
                'change',
                {composed: true, bubbles: true, value: suggestion.value, id: suggestion.id}
        ))
        this.focused = false;
    }
}