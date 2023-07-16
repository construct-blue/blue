import {html, LitElement, PropertyValues} from "lit";
import {customElement, property, query} from "lit/decorators.js";

declare global {
    interface HTMLElementTagNameMap {
        "ts-select": Select;
    }
}


@customElement('ts-select')
class Select extends LitElement {
    @property({type: Object})
    public options: { id: string, name: string }[] = []

    @property({type: String})
    public value: string

    @query('select')
    private input: HTMLSelectElement

    protected render() {
        return html`
            <select>
                ${this.options.map(value => html`
                    <option value="${value.id}">${value.name}</option>`
                )}
            </select>
        `
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        this.input.value = this.value
    }
}