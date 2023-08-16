import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {classMap} from "lit/directives/class-map.js"
import {customElement, property} from "lit/decorators.js";
import './TrainComposition';
import './StopoverTime'
import {lineName} from "../../Directive/LineName";
import {Stopover} from "../../Models/Stopover";
import {TimetableController} from "./TimetableController";
import {Client} from "../../Client/Client";

declare global {
    interface HTMLElementTagNameMap {
        "ts-timetable": Timetable;
    }
}

@customElement('ts-timetable')
class Timetable extends LitElement {
    @property({type: String})
    public profile!: string

    @property({type: Array<Stopover>})
    public stopovers!: Stopover[]

    @property({type: String, attribute: 'station-id'})
    public stationId: string = ''

    private controller!: TimetableController

    protected willUpdate(_changedProperties: PropertyValues) {
        super.willUpdate(_changedProperties);
        if (_changedProperties.size) {
            this.controller = new TimetableController(
                    this,
                    new Client(document.body.dataset.api ?? ''),
                    this.profile,
                    this.stopovers,
                    this.stationId
            )
        }
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
    `

    protected render() {
        return html`
            ${this.controller.stopovers.map(stopover => this.renderStopover(stopover))}
            <ul>
                <li><span class="green">•</span> = punktlich gemeldet</li>
                <li><span class="red">•</span> = verspätet gemeldet</li>
                <li><span>&#10005;</span> = Bedarfshalt</li>
            </ul>
        `;
    }

    protected renderStopover(stopover: Stopover) {
        return html`
            <p class=${classMap({selected: stopover.stop.id == this.stationId})}>
                ${stopover.stop.name}${stopover.departurePlatform ? ` (Bst. ${stopover.departurePlatform})` : nothing}
                ${stopover.changedLine && stopover.line ? html`
                    <span>&rarr; ${lineName(stopover.line)}</span>` : nothing}
                <ts-stopover-time .stopover="${stopover}"></ts-stopover-time>
                ${this.renderComposition(stopover)}
                <ts-remarks muted .remarks="${stopover.remarks}"></ts-remarks>
            </p>
        `
    }

    private renderComposition(stopover: Stopover) {
        if (!this.controller.hasVehicleInfo(stopover)) {
            return nothing;
        }
        if (this.controller.displayVehicleInfo(stopover)) {
            return html`
                <ts-composition profile="${this.profile}" .stopover="${stopover}"></ts-composition>`
        } else {
            return html`
                <button @click="${() => this.controller.addDisplayVehicleInfo(stopover)}">
                    <i style="font-family: oebb-symbols">W</i>
                </button>`;
        }
    }
}