import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Stopover, Trip} from "./Models/Trip";

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
    `

    protected renderStopover(stopover: Stopover) {
        return html`
            <p>${stopover.stop.name}<span>${this.formatStopoverTime(stopover)}</span></p>
        `
    }

    protected formatStopoverTime(stopover: Stopover) {
        const result = [];
        if (stopover.arrival) {
            result.push(html`${this.formatTime(stopover.arrival)}`)
        }

        if (stopover.departure) {
            if (result.length) {
                result.push(html` - `)
            }
            result.push(html`${this.formatTime(stopover.departure)}`)
        }

        if (stopover.delay) {
            result.push(html` + ${stopover.delay}`)
        }

        return result;
    }

    protected formatTime(dateString: string) {
        const date = new Date(dateString)
        return date.toLocaleTimeString(undefined, {timeStyle: 'short'})
    }
}