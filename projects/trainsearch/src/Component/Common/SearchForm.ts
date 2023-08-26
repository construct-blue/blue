import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
import "./Select"
import "./SearchInput"
import {SelectEvent} from "./Select";
import {SearchChangeEvent, SearchSuggestEvent, SearchSuggestion} from "./SearchInput";
import {UicPrefix} from "../../Models/UicPrefix";

interface SearchEventInit<T> extends EventInit {
    id: string
    value: T
    profile: string
    uicPrefix: string
}

export class SearchFormEvent<T> extends Event {
    public id: string
    public value: T
    public profile: string
    public uicPrefix: string

    constructor(type: string, eventInitDict: SearchEventInit<T>) {
        super(type, eventInitDict);
        this.id = eventInitDict.id
        this.value = eventInitDict.value
        this.profile = eventInitDict.profile
        this.uicPrefix = eventInitDict.uicPrefix
    }
}

interface SearchSuggestEventInit extends EventInit {
    value: string
    profile: string
    uicPrefix: string
}

export class SearchFormSuggestEvent extends Event {
    public value: string
    public profile: string
    public uicPrefix: string

    constructor(type: string, eventInitDict: SearchSuggestEventInit) {
        super(type, eventInitDict);
        this.value = eventInitDict.value
        this.profile = eventInitDict.profile
        this.uicPrefix = eventInitDict.uicPrefix
    }
}

@customElement('ts-search-form')
class SearchForm<T> extends LitElement {
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
    public suggestions: SearchSuggestion<T>[] = []

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
        this.dispatchEvent(new SearchFormSuggestEvent('suggest', {
            value: this.value,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }

    private onChangeUicProfix(event: SelectEvent) {
        event.stopPropagation()
        this.uicPrefix = event.value
        this.dispatchEvent(new SearchFormSuggestEvent('suggest', {
            value: this.value,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }

    private onSuggest(event: SearchSuggestEvent) {
        event.stopPropagation()
        this.value = event.value
        this.dispatchEvent(new SearchFormSuggestEvent(event.type, {
            value: event.value,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }

    private onChange(event: SearchChangeEvent<T>) {
        event.stopPropagation()
        this.dispatchEvent(new SearchFormEvent<T>(event.type, {
            value: event.value,
            id: event.id,
            profile: this.profile,
            uicPrefix: this.uicPrefix
        }))
    }
}