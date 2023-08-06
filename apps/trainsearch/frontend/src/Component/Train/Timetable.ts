import {css, html, LitElement, nothing, TemplateResult} from "lit";
import {classMap} from "lit/directives/class-map.js"
import {customElement, property} from "lit/decorators.js";
import {Stopover, Trip} from "../../Models/Trip";
import './TrainComposition';
import './StopoverTime'
import TrainSearchClient from "../../Client/TrainSearchClient";
import {lineName} from "../../Directive/LineName";

declare global {
    interface HTMLElementTagNameMap {
        "ts-timetable": Timetable;
    }
}

@customElement('ts-timetable')
class Timetable extends LitElement {
    private client = new TrainSearchClient(document.body.dataset.api)

    @property()
    public trip: Trip

    @property({type: String})
    public profile: string

    @property({type: String, attribute: 'station-id'})
    public stationId: string = ''

    private stations = []

    protected async scheduleUpdate():  Promise<unknown> {
        this.stations = await this.client.stations(this.profile)
        return super.scheduleUpdate();
    }

    protected render(): TemplateResult {
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
            background: var(--dark-grey);
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
                ${stopover.stop.name}${stopover.departurePlatform ? ` (Bst. ${stopover.departurePlatform})`: nothing}
                <ts-stopover-time .stopover="${stopover}"></ts-stopover-time>
                ${stopover.changedLine ? html`<span>&rarr; ${lineName(stopover.line)}</span>` : nothing}
                ${this.renderComposition(stopover)}
                <ts-remarks muted .remarks="${stopover.remarks}"></ts-remarks>
            </p>
        `
    }

    private renderComposition(stopover: Stopover)
    {
        const lastStopover = this.trip.stopovers[this.trip.stopovers.length - 1]
        if (this.profile === 'oebb' && !this.trip.foreign && stopover.stop.id !== lastStopover.stop.id && Object.keys(this.stations).includes(stopover.stop.id)) {
            return html`<ts-composition profile="${this.profile}" .stopover="${stopover}"></ts-composition>`
        }
        return nothing;
    }
}