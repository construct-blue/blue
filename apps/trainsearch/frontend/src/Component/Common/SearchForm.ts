import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
import "./Select"
import "./SearchInput"
import {SelectEvent} from "./Select";
import {SearchInputEvent, SearchSuggestion} from "./SearchInput";
import {UicPrefix} from "../../Models/UicPrefix";

interface SearchEventInit extends EventInit {
    value: string
    id?: string
    profile: string
    uicPrefix: string
}

export class SearchFormEvent extends Event {
    public value: string
    public id?: string
    public profile: string
    public uicPrefix: string

    constructor(type: string, eventInitDict: SearchEventInit) {
        super(type, eventInitDict);
        this.value = eventInitDict.value
        this.id = eventInitDict.id
        this.profile = eventInitDict.profile
        this.uicPrefix = eventInitDict.uicPrefix
    }
}

@customElement('ts-search-form')
class SearchForm extends LitElement {
    @property({type: Array})
    public profiles = [
        {
            id: 'oebb',
            name: 'ÖBB'
        },
        {
            id: 'db',
            name: 'DB'
        }
    ]

    @property({type: Array})
    public uicPrefixes: UicPrefix[] = [];

    @property({type: String})
    public profile: string = 'oebb'

    @property({type: String})
    public uicPrefix: string = '81'

    @property({type: String})
    public value: string = ''

    @property({type: Array})
    public suggestions: SearchSuggestion[] = []

    static styles = css`
        :host(ts-search-form) {
            display: flex;
            gap: .25rem;
        }

        ts-search-input {
            flex-grow: 1;
        }

        button {
            border: none;
            padding: 0;
            margin: 0;
            font-size: 2rem;
            line-height: 1;
            background: none;
        }
    `

    private getFlagEmoji(countryCode: string) {
        if (countryCode === '-') {
            return '';
        }
        if (countryCode == 'UK') {
            return '🇬🇧';
        }
        const codePoints = countryCode
                .toUpperCase()
                .split('')
                .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    protected render() {
        return html`
            <ts-select font-family="oebb-light-symbols" .options="${this.profiles}" .value="${this.profile}"
                       @change="${this.onChangeProfile}"></ts-select>
            ${this.uicPrefixes.length ? html`
                <ts-select .options="${this.uicPrefixes.map(uicPrefix => {
                    return {id: uicPrefix.prefix, name: this.getFlagEmoji(uicPrefix.name) + uicPrefix.name}
                })}" .value="${this.uicPrefix}" @change="${this.onChangeUicProfix}"></ts-select>` : nothing}
            <ts-search-input @suggest="${this.onSuggest}" @change="${this.onChange}"
                             .suggestions="${this.suggestions}"
                             .value="${this.value}"
            ></ts-search-input>
        `;
    }

    private onChangeProfile(event: SelectEvent) {
        event.stopPropagation()
        this.profile = event.value
        this.dispatchEvent(new SearchFormEvent('suggest', {
            value: this.value,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }

    private onChangeUicProfix(event: SelectEvent) {
        event.stopPropagation()
        this.uicPrefix = event.value
        this.dispatchEvent(new SearchFormEvent('suggest', {
            value: this.value,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }

    private onSuggest(event: SearchInputEvent) {
        event.stopPropagation()
        this.value = event.value
        this.dispatchEvent(new SearchFormEvent(event.type, {
            value: event.value,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }

    private onChange(event: SearchInputEvent) {
        event.stopPropagation()
        this.dispatchEvent(new SearchFormEvent(event.type, {
            value: event.value,
            id: event.id,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }
}