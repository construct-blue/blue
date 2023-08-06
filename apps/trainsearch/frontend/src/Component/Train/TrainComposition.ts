import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {classMap} from "lit/directives/class-map.js";
import {TrainSearchController} from "../../Client/TrainSearchController";
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
    private controller = new TrainSearchController(this)

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
            line-height: 1.05;
            border: 1px solid var(--light-border);
            border-top-left-radius: .5rem;
            border-top-right-radius: .5rem;
            background: var(--s-bahn-blue);
        }

        span.low {
            background: var(--green);
        }

        span.medium {
            background: var(--orange);
        }

        span.high {
            background: var(--red);
        }

        span.TFZ,
        span.locked {
            background: var(--grey);
        }


        b {
            font-family: FrutigerNextPro-Bold, sans-serif;
        }
    `

    protected async scheduleUpdate(): Promise<unknown> {
        if (this.stopover.line) {
            const date = this.stopover.departure ?? this.stopover.arrival
            this.compostion = await this.controller.composition(this.stopover.line.id, this.stopover.stop.id, date, this.profile)
        }
        return super.scheduleUpdate();
    }

    protected render() {
        if (!this.compostion?.vehicles) {
            return nothing
        }
        return html`
            ${this.compostion.vehicles.map(v =>
                    html`<span class="${classMap({locked: v.locked || ['TFZ', 'DDm'].includes(v.type), low: v.load && v.load < 33, medium: v.load >= 33 && v.load <= 66, high: v.load > 66})}">${v.ranking ? html`<b>${v.ranking}</b>:&nbsp;` : nothing}${v.type}
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