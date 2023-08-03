import {css, html, LitElement, nothing} from "lit";
import {customElement, property, query, state} from "lit/decorators.js";

interface SearchEventInit extends EventInit {
    value: string
    id?: string
}

export class SearchInputEvent extends Event {
    public value: string
    public id?: string

    constructor(type: string, eventInitDict: SearchEventInit) {
        super(type, eventInitDict);
        this.value = eventInitDict.value
        this.id = eventInitDict.id
    }
}

export interface SearchSuggestion
{
    id: string,
    name: string
}

@customElement('ts-search-input')
class SearchInput extends LitElement {
    @property({type: String})
    public value: string = ''

    @property({type: String})
    public placeholder: string = ''

    @property({type: Array})
    public suggestions: SearchSuggestion[];

    @query('input')
    private input: HTMLInputElement

    @state()
    private focused: boolean = false

    static styles = css`
        :host {
            position: relative;
        }

        div {
            display: flex;
            flex-direction: column;
            position: absolute;
            max-height: 50vh;
            overflow: auto;
            z-index: 1;
            left: 0;
            top: 100%;
            border-radius: .25rem;
            background: var(--dark-grey);
            color: #fff;
        }

        input {
            padding: .25rem;
            border-radius: .25rem;
            font-size: 1rem;
            background: var(--dark-grey);
            color: #fff;
            border: none;
        }
        
        button {
            border: none;
            padding: .5rem;
            background: none;
        }
    `

    onclick = e => e.stopPropagation()

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
                   @keyup="${this.changeKeyword}">
            ${this.renderSuggestions()}
        `;
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
        this.value = this.input.value
        this.dispatchEvent(new SearchInputEvent(
                'suggest',
                {composed: true, bubbles: true, value: this.input.value}
        ))
    }

    private clickSuggestion(suggestion) {
        this.dispatchEvent(new SearchInputEvent(
                'change',
                {composed: true, bubbles: true, value: suggestion.name, id: suggestion.id}
        ))
        this.focused = false;
    }
}