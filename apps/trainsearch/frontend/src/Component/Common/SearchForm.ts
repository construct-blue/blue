import {html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import "./Select"
import "./SearchInput"
import {SelectEvent} from "./Select";

@customElement('ts-search-form')
class SearchForm extends LitElement {
    @property({type: Array})
    private profiles = [
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
    private uicPrefixes = [
        {
            id: '81',
            name: 'AT'
        }
    ];

    @property({type: String})
    private profile: string = 'oebb'

    @property({type: String})
    private uicPrefix: string = '81'

    protected render() {
        return html`
            <ts-select .options="${this.profiles}" .value="${this.profile}"
                       @change="${(event: SelectEvent) => this.profile = event.value}"></ts-select>
            <ts-select .options="${this.uicPrefixes}" .value="${this.uicPrefix}"
                       @change="${(event: SelectEvent) => this.uicPrefix = event.value}"></ts-select>
            <ts-search-input></ts-search-input>
        `;
    }
}