import {css, html, LitElement, nothing} from "lit";
import {classMap} from "lit/directives/class-map.js"
import {customElement, property, state} from "lit/decorators.js";
import {Trip} from "../../Models/Trip";
import './TrainComposition';
import './StopoverTime'
import {lineName} from "../../Directive/LineName";
import {TrainSearchController} from "../../Client/TrainSearchController";
import {Stopover} from "../../Models/Stopover";

declare global {
    interface HTMLElementTagNameMap {
        "ts-timetable": Timetable;
    }
}

@customElement('ts-timetable')
class Timetable extends LitElement {
    private controller = new TrainSearchController(this)

    @property()
    public trip: Trip|null = null

    @property({type: String})
    public profile: string = ''

    @property({type: String, attribute: 'station-id'})
    public stationId: string = ''

    private stations: {
        eva: string
    }[] = []

    @state()
    private compositions: string[] = []

    protected async scheduleUpdate(): Promise<unknown> {
        if (this.stationId && !this.compositions.includes(this.stationId)) {
            this.compositions.push(this.stationId)
        }
        if (this.trip && this.trip.stopovers && this.trip.stopovers.length) {
            if (this.trip.stopovers[0]) {
                this.compositions.push(this.trip.stopovers[0].stop.id)
            }
            const ids = this.trip.stopovers
                    .filter(stopover => stopover.changedLine)
                    .map(stopover => stopover.stop.id)
            this.compositions.push(...ids)
        }
        this.stations = await this.controller.stations(this.profile)
        return super.scheduleUpdate();
    }

    protected render() {
        if (!this.trip) {
            return nothing;
        }
        return html`
            ${this.trip.stopovers.map(stopover => this.renderStopover(stopover))}
            <ul>
                <li><span class="green">•</span> = punktlich gemeldet</li>
                <li><span class="red">•</span> = verspätet gemeldet</li>
                <li><span>&#10005;</span> = Bedarfshalt</li>
            </ul>
        `;
    }

    static styles = css`
        :host(ts-timetable) {
            display: flex;
            gap: 1rem;
            flex-direction: column;
        }

        p {
            margin: 0;
            display: flex;
            flex-direction: column;
        }

        p.selected {
            background: rgba(255, 255, 255, 0.20);
            border: 1px solid #fff;
            padding: .25rem;
            border-radius: .25rem;
            font-family: FrutigerNextPro-Bold, sans-serif;
            font-weight: bold;
        }

        span {
            display: flex;
            gap: .25rem;
            align-items: center;
        }

        ul span {
            display: inline-flex;
            width: 1.5rem;
        }

        li {
            list-style: none;
            display: flex;
            align-items: center;
        }

        button {
            font-size: 1rem;
            background: var(--dark-grey);
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .25rem;
            align-self: end;
        }
        
        .red, .green {
            font-size: 2.5rem;
            line-height: 0;
        }

        .red {
            color: var(--red);
        }

        .green {
            color: var(--green);
        }

        .delay {
            font-family: FrutigerNextPro-Bold, sans-serif;
            font-weight: bold;
        }
    `

    protected renderStopover(stopover: Stopover) {
        return html`
            <p class=${classMap({selected: stopover.stop.id == this.stationId})}>
                ${stopover.stop.name}${stopover.departurePlatform ? ` (Bst. ${stopover.departurePlatform})` : nothing}
                ${stopover.changedLine && stopover.line ? html`<span>&rarr; ${lineName(stopover.line)}</span>` : nothing}
                <ts-stopover-time .stopover="${stopover}"></ts-stopover-time>
                ${this.renderComposition(stopover)}
                <ts-remarks muted .remarks="${stopover.remarks}"></ts-remarks>
            </p>
        `
    }

    private renderComposition(stopover: Stopover) {
        const lastStopover = this.trip?.stopovers[this.trip.stopovers.length - 1]
        if (lastStopover && this.stations && this.profile === 'oebb' && !this.trip?.foreign && stopover.stop.id !== lastStopover.stop.id && this.stations.map(station => station.eva).includes(stopover.stop.id)) {
            if (!this.compositions.includes(stopover.stop.id)) {
                return html`
                    <button @click="${() => this.onClickShowComposition(stopover)}"><i style="font-family: oebb-symbols">W</i></button>`;
            }
            return html`
                <ts-composition profile="${this.profile}" .stopover="${stopover}"></ts-composition>`
        }
        return nothing;
    }

    private onClickShowComposition(stopover: Stopover) {
        this.compositions.push(stopover.stop.id)
        this.requestUpdate()
    }
}