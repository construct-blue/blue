import {html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import "./Select"
import "./SearchInput"
import {SelectEvent} from "./Select";

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
    public uicPrefixes = [
        {
            id: '81',
            name: 'AT'
        }
    ];

    @property({type: String})
    public profile: string = 'oebb'

    @property({type: String})
    public uicPrefix: string = '81'

    public results = [
        {
            id: '1',
            name: 'First Result',
            description: 'asdfasdf'
        },
        {
            id: '2',
            name: 'Second Result',
            description: 'fasdfasd'
        }
    ]

    protected render() {
        return html`
            <ts-select .options="${this.profiles}" .value="${this.profile}"
                       @change="${(event: SelectEvent) => this.profile = event.value}"></ts-select>
            <ts-select .options="${this.uicPrefixes}" .value="${this.uicPrefix}"
                       @change="${(event: SelectEvent) => this.uicPrefix = event.value}"></ts-select>
            <ts-search-input .suggestions="${this.results}"></ts-search-input>
        `;
    }
}