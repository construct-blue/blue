import {css, html, LitElement, nothing, PropertyValues, TemplateResult} from "lit";
import {customElement, state} from "lit/decorators.js";
import {TrainNumberController} from "./TrainNumberController";
import './NumberInput'
import './TrainDetails'
import {TrainNumberContext, trainNumberContext} from "./TrainNumberContext";
import {ObjectContextProvider} from "libs/lit-helper/src/Mixin/ObjectContext";
import {testTrip} from "./Models/TestTrip";

@customElement('ts-number')
export class TrainNumber extends ObjectContextProvider(LitElement)(trainNumberContext, new TrainNumberContext()) {
    private controller = new TrainNumberController(this)

    private url: URL = new URL(document.location.href)

    static styles = css`
        :host(ts-number) {
            display: flex;
            flex-direction: column;
        }
    `

    protected async scheduleUpdate(): Promise<unknown> {

        if (this.context.number && this.context.operator) {
            this.context.trip = null
            this.context.trip = await this.controller.trip(this.context.number, this.context.operator, this.context.source)
        } else {
            this.context.trip = null
        }

        if (this.url.searchParams.get('test') == '1') {
            this.context.trip = testTrip
        }

        return super.scheduleUpdate();
    }


    protected render() {
        return html`
            <ts-number-input></ts-number-input>
            ${this.context.trip ? html`
                <ts-details .trip="${this.context.trip}"></ts-details>` : nothing}
        `;
    }
}