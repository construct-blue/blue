import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {TrainNumberController} from "../../Page/TrainNumber/TrainNumberController";
import {ObjectContextConsumer} from "../../../../../../libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "../../Page/TrainNumber/TrainNumberContext";
import {Composition} from "../../Models/Composition";
import {Stopover} from "../../Models/Trip";

declare global {
    interface HTMLElementTagNameMap {
        "ts-composition": TrainComposition;
    }
}


@customElement('ts-composition')
export class TrainComposition extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    private controller = new TrainNumberController(this)

    @property({type: String})
    public profile: string

    @property({type: Object})
    public stopover: Stopover

    @property()
    private compostion: Composition = null

    static styles = css`
      :host {
        display: flex;
        overflow: auto;
        font-size: .75rem;
        gap: .25rem;
      }
    `

    protected async scheduleUpdate(): Promise<unknown> {
        if (this.stopover.line) {
            this.compostion = await this.controller.composition(this.stopover.line.id, this.stopover.stop.id, this.profile)
        }
        return super.scheduleUpdate();
    }

    protected render() {
        if (!this.compostion?.vehicles) {
            return nothing
        }
        return html`
           ${this.compostion.vehicles.map(v => html`${v.ranking ? html`${v.ranking}:&nbsp;` : nothing}${v.type}<br>${this.formatUIC(v.uicNumber)}`).map(vehicle => html`<span>${vehicle}</span>`)}
        `;
    }

    private formatUIC(uic: string) {
        return unsafeHTML(uic.substring(0, 2)
                + '&nbsp;' + uic.substring(2, 4)
                + '&nbsp;' + uic.substring(4, 8)
                + '&nbsp;' + uic.substring(8, 11)
                + '&nbsp;' + uic.substring(11))
    }
}