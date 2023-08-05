import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
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
    `

    protected async scheduleUpdate(): Promise<unknown> {
        this.compostion = await this.controller.composition(this.stopover.line.id, this.stopover.stop.id, this.profile)
        return super.scheduleUpdate();
    }

    protected render() {
        if (!this.compostion?.vehicles) {
            return nothing
        }
        return html`
            <small>${this.compostion.vehicles.map(v => `${v.ranking ? v.ranking + ': ' : ''}${v.type} ${this.formatUIC(v.uicNumber)}`).join(', ')}</small>
        `;
    }

    private formatUIC(uic: string) {
        return uic.substring(0, 2)
                + ' ' + uic.substring(2, 4)
                + ' ' + uic.substring(4, 8)
                + ' ' + uic.substring(8, 11)
                + '-' + uic.substring(11)
    }
}