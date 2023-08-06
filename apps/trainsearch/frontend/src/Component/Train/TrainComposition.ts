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
        :host(ts-composition) {
            display: flex;
            flex-wrap: wrap;
            overflow: scroll;
            font-size: .75rem;
            gap: .25rem;
        }

        span {
            padding: .25rem;
            border: 1px solid var(--light-border);
            border-top-left-radius: .5rem;
            border-top-right-radius: .5rem;
            background: var(--green);
        }
        
        span.TFZ {
            background: var(--grey);
        }

        b {
            font-family: FrutigerNextPro-Bold, sans-serif;
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
            ${this.compostion.vehicles.map(v =>
                    html`<span class="${v.type}">${v.ranking ? html`<b>${v.ranking}</b>:&nbsp;` : nothing}${v.type}
                    <br>${this.formatUIC(v.uicNumber)}</span>`)}
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