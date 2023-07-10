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

        this.addEventListener('search', async (e) => {
            e.stopPropagation()
            this.context.trip = null
            this.context.trip = await this.controller.trip(this.context.number, this.context.uicPrefix, this.context.source)
        })

        this.addEventListener('details', async (e: CustomEvent) => {
            e.stopPropagation()
            this.context.trip = null
            this.context.trip = await this.controller.tripdetails(e.detail, this.context.source)
        })
    }

    protected async firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.context.stations = await this.controller.stations(this.context.source)
    }

    protected render() {
        return html`
            <ts-number-input></ts-number-input>
            ${this.context.trip ? html`
                <ts-details .trip="${this.context.trip}"></ts-details>` : nothing}
        `;
    }
}