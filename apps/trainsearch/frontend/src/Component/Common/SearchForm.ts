import {html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import "./Select"

@customElement('ts-search-form')
class SearchForm extends LitElement {
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

    private uicPrefixes = [
        {
            id: '81',
            name: 'AT'
        }
    ];

    private profile: string = 'oebb'
    private uicPrefix: string = '81'

    protected render() {
        return html`
            <ts-select .options="${this.profiles}" .value="${this.profile}" @change=""></ts-select>
            <ts-select .options="${this.uicPrefixes}" .value="${this.uicPrefix}" @change=""></ts-select>
        `;
    }
}