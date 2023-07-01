import {html, LitElement, TemplateResult} from "lit";
import {customElement, query} from "lit/decorators.js";
import {ObjectContextConsumer} from "../../Mixin/Context";
import {trainNumberContext} from "./TrainNumberContext";

@customElement('ts-list')
class TrainList extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    protected render(): TemplateResult {
        return html`
            <span>list</span>
            <span>${this.context.operator}</span>
        `;
    }
}