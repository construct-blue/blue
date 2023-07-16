import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
import {TrainNumberController} from "../../Page/TrainNumber/TrainNumberController";
import {ObjectContextConsumer} from "../../../../../../libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "../../Page/TrainNumber/TrainNumberContext";

@customElement('ts-composition')
export class Compostion extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    private controller = new TrainNumberController(this)

    @property({attribute: 'station-id'})
    public stationId: string
    private compostion: {
        vehicles: {
            uicNumber: string,
            type: string,
            ranking: number
        }[]
    } = null

    static styles = css`
    `

    protected async scheduleUpdate(): Promise<unknown> {
        this.compostion = null
        const lastStopover = this.context.trip.stopovers[this.context.trip.stopovers.length - 1]
        if (this.context.hasComposition && !this.context.trip.foreign && this.stationId !== lastStopover.stop.id && this.context.stations && Object.keys(this.context.stations).includes(this.stationId)) {
            this.compostion = await this.controller.composition(this.context.trip.line.id, this.stationId, this.context.source)
        }
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

    private formatUIC(uic: string)
    {
        return uic.substring(0, 2)
                + ' ' + uic.substring(2, 4)
                + ' ' + uic.substring(4, 8)
                + ' ' + uic.substring(8, 11)
                + '-' + uic.substring(11)
    }
}