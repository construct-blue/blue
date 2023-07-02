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

    connectedCallback() {
        super.connectedCallback();

        if (this.url.searchParams.has('number') && this.url.searchParams.has('operator')) {
            this.context.number = this.url.searchParams.get('number')
            this.context.operator = this.url.searchParams.get('operator')
        }
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        history.replaceState({}, '', this.url)
    }

    protected async scheduleUpdate(): Promise<unknown> {

        if (this.context.number && this.context.operator) {
            try {
                this.context.trip = await this.controller.trip(this.context.number, this.context.operator)
                this.url.searchParams.set('number', this.context.number)
                this.url.searchParams.set('operator', this.context.operator)
            } catch (e) {
                console.error(e)
                this.context.trip = null
            }
        } else {
            this.context.trip = null
            this.url.searchParams.delete('number')
            this.url.searchParams.delete('operator')
        }

        if (this.url.searchParams.get('test') == '1') {
            this.context.trip = testTrip
        }

        return super.scheduleUpdate();
    }


    protected render(): TemplateResult {
        return html`
            <ts-number-input></ts-number-input>
            ${this.context.trip ? html`
                <ts-details .trip="${this.context.trip}"></ts-details>` : nothing}
        `;
    }
}