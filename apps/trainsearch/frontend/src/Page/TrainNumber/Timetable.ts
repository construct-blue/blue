import {css, html, LitElement, nothing, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Stopover, Trip} from "./Models/Trip";
import {datetime} from "../../Directive/DateTime";
import './Compostion';

@customElement('ts-timetable')
class Timetable extends LitElement {
    @property()
    public trip: Trip

    protected render(): TemplateResult {
        return html`
            ${this.trip.stopovers.map(stopover => this.renderStopover(stopover))}
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

        span {
            display: flex;
            gap: .25rem;
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
            <p>
                ${stopover.stop.name}${stopover.departurePlatform ? ` (Bst. ${stopover.departurePlatform})`: nothing}
                <span>${this.formatStopoverTime(stopover)}</span>
                <ts-composition station-id="${stopover.stop.id}"></ts-composition>
                <small style="color: var(--grey)">${stopover.remarks.map(remark => remark.message).join(', ')}</small>
            </p>
        `
    }

    protected formatStopoverTime(stopover: Stopover) {
        const result = [];
        if (stopover.arrival) {
            if (stopover.arrivalDelay && stopover.reported) {
                result.push(html`<span class="red">•</span> ${datetime(stopover.arrival, "time")} <span class="delay">(+ ${stopover.arrivalDelay / 60}
                    )</span>`)
            } else if (stopover.reported) {
                result.push(html`<span class="green">•</span> ${datetime(stopover.arrival, "time")}`)
            } else if (stopover.arrivalDelay) {
                result.push(html`${datetime(stopover.arrival, "time")} <span
                        class="delay">(+ ${stopover.arrivalDelay / 60})</span>`)
            } else {
                result.push(html`${datetime(stopover.arrival, "time")}`)
            }
        }

        if (stopover.departure) {
            if (result.length) {
                result.push(html` - `)
            }
            if (stopover.departureDelay && stopover.reported) {
                result.push(html`<span class="red">•</span> ${datetime(stopover.departure, "time")} <span class="delay">(+ ${stopover.departureDelay / 60}
                    )</span>`)
            } else if (stopover.reported) {
                result.push(html`<span class="green">•</span> ${datetime(stopover.departure, "time")}`)
            } else if (stopover.departureDelay) {
                result.push(html`${datetime(stopover.departure, "time")} <span
                        class="delay">(+ ${stopover.departureDelay / 60})</span>`)
            } else {
                result.push(html`${datetime(stopover.departure, "time")}`)
            }
        }

        return result;
    }
}