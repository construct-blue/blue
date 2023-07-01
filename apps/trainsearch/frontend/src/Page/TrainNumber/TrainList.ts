import {html, LitElement, TemplateResult} from "lit";
import {customElement, query} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "./TrainNumberContext";

@customElement('ts-list')
class TrainList extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    protected render(): TemplateResult {
        return html`
            <span>${this.context.operator}</span>
            <span>${this.context.number}</span>
        `;
    }
}