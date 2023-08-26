import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement, property} from "lit/decorators.js";
import {unsafeHTML} from "lit/directives/unsafe-html.js";
import {classMap} from "lit/directives/class-map.js";
import {TrainSearchController} from "../../Client/TrainSearchController";
import {Composition} from "../../Models/Composition";
import {Stopover} from "../../Models/Stopover";

declare global {
    interface HTMLElementTagNameMap {
        "ts-composition": TrainComposition;
    }
}


@customElement('ts-composition')
export class TrainComposition extends LitElement {
    private controller = new TrainSearchController(this)

    @property({type: String})
    public profile: string = ''

    @property({type: Object})
    public stopover: Stopover | null = null

    @property()
    private compostion: Composition | null = null

    static styles = css`
        :host(ts-composition) {
            display: flex;
            flex-direction: column;
            height: 2.5rem;
            font-family: FrutigerNextPro-Regular, sans-serif;
        }

        p {
            display: flex;
            margin: 0;
            flex-wrap: nowrap;
            overflow: auto;
            font-size: .75rem;
            gap: .25rem;
        }

        p > b {
            display: flex;
            align-items: center;
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
        if (this.stopover && this.stopover.line) {
            const date = this.stopover.departure ?? this.stopover.arrival ?? ''
            this.compostion = await this.controller.composition(this.stopover.line.id, this.stopover.stop.id, date, this.profile)
        }
        return super.scheduleUpdate();
    }

    protected render() {
        if (!this.compostion?.vehicles) {
            return html`Wagenreihung nicht verfügbar.`
        }
        return html`
            <p>
                <b>&larr;</b>
                ${this.compostion.vehicles.map(v =>
                        html`<span class="${classMap({
                            locked: v.locked || ['TFZ', 'DDm'].includes(v.type),
                            low: v.load !== null && v.load < 33,
                            medium: v.load >= 33 && v.load <= 66,
                            high: v.load > 66
                        })}">${v.ranking ? html`<b>${v.ranking}</b>:&nbsp;` : nothing}${v.type}
                    <br>${this.formatUIC(v.uicNumber)}</span>`)}
            </p>
        `;
    }

    private formatUIC(uic: string) {
        return unsafeHTML(uic.substring(0, 2)
                + '&nbsp;' + uic.substring(2, 4)
                + '&nbsp;<b>' + uic.substring(4, 8)
                + '</b>&nbsp;' + uic.substring(8, 11)
                + '&nbsp;' + uic.substring(11))
    }
}