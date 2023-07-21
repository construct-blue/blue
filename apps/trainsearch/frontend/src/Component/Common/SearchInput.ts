import {css, html, LitElement, nothing} from "lit";
import {customElement, property, query, state} from "lit/decorators.js";

interface SearchEventInit extends EventInit {
    value: string
}

class SearchEvent extends Event {
    public value: string

    constructor(type: string, eventInitDict: SearchEventInit) {
        super(type, eventInitDict);
        this.value = eventInitDict.value
    }
}

@customElement('ts-search-input')
class SearchInput extends LitElement {
    @property({type: String})
    public value: string = ''

    @property({type: String})
    public placeholder: string = ''

    @property({type: Array})
    public suggestions: { id: string, name: string }[];

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
        this.dispatchEvent(new SearchEvent(
                'suggest',
                {composed: true, bubbles: true, value: this.input.value}
        ))
    }

    private clickSuggestion(suggestion) {
        this.dispatchEvent(new SearchEvent(
                'change',
                {composed: true, bubbles: true, value: suggestion.id}
        ))
        this.focused = false;
    }
}