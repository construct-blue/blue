import {html, LitElement, nothing} from "lit";
import {customElement, property, query} from "lit/decorators.js";

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

    protected render() {
        return html`
            <input type="text" .placeholder="${this.placeholder}" .value="${this.value}" @keyup="${this.changeKeyword}">
            ${this.renderSuggestions()}
        `;
    }


    private renderSuggestions() {
        if (this.suggestions && this.suggestions.length) {
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

    private changeKeyword()
    {
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
    }
}