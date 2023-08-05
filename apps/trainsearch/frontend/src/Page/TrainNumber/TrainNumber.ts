import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement} from "lit/decorators.js";
import {TrainNumberController} from "./TrainNumberController";
import './TrainNumberForm'
import '../../Component/Train/TrainDetails'
import {TrainNumberContext, trainNumberContext} from "./TrainNumberContext";
import {ObjectContextProvider} from "libs/lit-helper/src/Mixin/ObjectContext";

@customElement('ts-number')
export class TrainNumber extends ObjectContextProvider(LitElement)(trainNumberContext, new TrainNumberContext()) {
    private controller = new TrainNumberController(this)

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

    protected render() {
        return html`
            <ts-number-form></ts-number-form>
            ${this.context.trip ? html`
                <ts-details .trip="${this.context.trip}" profile="${this.context.source}"></ts-details>` : nothing}
        `;
    }
}