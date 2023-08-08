import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement, property} from "lit/decorators.js";
import {repeat} from "lit/directives/repeat.js";
import {Trip} from "../../Models/Trip";
import './StopoverTime'
import {lineName} from "../../Directive/LineName";
import {classMap} from "lit/directives/class-map.js";

interface TripEventInit extends EventInit {
    trip: Trip
}

export class TripEvent extends Event {
    trip: Trip

    constructor(type: string, eventInitDict?: TripEventInit) {
        super(type, eventInitDict);
        this.trip = eventInitDict.trip
    }
}

@customElement('ts-trip-list')
class TripList extends LitElement {
    @property({type: Array<Trip>})
    public trips: Trip[]

    private interval

    static styles = css`
        :host(ts-trip-list) {
            overflow: scroll;
            display: flex;
            gap: .5rem;
            flex-direction: column;
            padding: 1rem 0;
        }

        button {
            font-size: 1rem;
            background: var(--dark-grey);
            text-align: left;
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .25rem;
            display: flex;
            flex-wrap: wrap;
        }

        button span {
            flex: 1 0 0;
        }


        button span:last-of-type {
            flex: 1 0 100%
        }


        small {
            color: var(--grey)
        }

        .missed {
            color: var(--grey)
        }

        .soon {
            display: inline-block;
            align-self: center;
            background: var(--grey);
            width: .75rem;
            height: .75rem;
            border-radius: .75rem;
            animation: fade 2s linear infinite;
        }
        
        .very.soon {
            background: var(--orange);
        }

        .green.soon {
            background: var(--green);
        }

        @keyframes fade {
            0% {
                opacity: .25;
            }
            45% {
                opacity: 1;
            }
            55% {
                opacity: 1;
            }
            100% {
                opacity: .25;
            }
        }
    `

    private missed(trip: Trip) {
        return trip.stopovers[0]?.departure && (new Date(trip.stopovers[0].departure)).valueOf() < Date.now();
    }

    private seconds(trip: Trip) {
        if (!trip.stopovers[0]?.departure) {
            return false;
        }
        const milliseconds = (new Date(trip.stopovers[0].departure)).valueOf() - Date.now();
        if (milliseconds <= 0) {
            return false;
        }
        return milliseconds / 1000;
    }

    private soon(trip: Trip, threshold: number = 600) {
        const seconds = this.seconds(trip);
        if (!seconds) {
            return false;
        }
        return seconds < threshold;
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.interval = setInterval(() => this.requestUpdate(), 60)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this.interval)
    }

    protected render() {

        if (this.trips) {
            return repeat(this.trips, trip => trip.id, trip => html`
                <button @click="${() => this.onClick(trip)}"
                        class="${classMap({missed: this.missed(trip)})}">
                    <span>
                        ${this.soon(trip) ? html`<span class="soon${this.soon(trip, 300) ? ' green' : ''}${this.soon(trip, 60) ? ' very' : ''}"></span>` : nothing}${lineName(trip.line)}
                    </span>
                    <ts-stopover-time .stopover="${trip.stopovers[0]}"></ts-stopover-time>
                    <span>
                        ${trip.direction}
                    </span>
                </button>
            `)
        }

        return nothing
    }

    private onClick(trip: Trip) {
        this.dispatchEvent(new TripEvent('select', {trip: trip, bubbles: true, composed: true}))
    }
}