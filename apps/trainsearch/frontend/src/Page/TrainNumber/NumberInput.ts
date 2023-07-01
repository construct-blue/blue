import {html, LitElement, TemplateResult} from "lit";
import {customElement, query} from "lit/decorators.js";
import {ObjectContextConsumer} from "../../Mixin/Context";
import {trainNumberContext} from "./TrainNumberContext";

@customElement('ts-number-input')
class NumberInput extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    @query('input')
    private input: HTMLInputElement
    @query('select')
    private select: HTMLSelectElement

    protected render(): TemplateResult {
        return html`
            <input type="text" @change="${this.changeNumber}">
            <select @change="${this.changeOperator}">
                <option value="oebb">ÖBB</option>
                <option value="db">DB</option>
            </select>
        `;
    }

    private changeOperator()
    {
        this.context.operator = this.select.value
    }

    private changeNumber() {
        this.context.number = this.input.value
    }
}