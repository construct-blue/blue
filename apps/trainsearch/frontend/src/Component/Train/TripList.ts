import {css, html, LitElement, nothing} from "lit";
import {customElement, property} from "lit/decorators.js";
import {repeat} from "lit/directives/repeat.js";
import {Trip} from "../../Models/Trip";
import {datetime} from "../../Directive/DateTime";

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
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .25rem;
        }
        
        small {
            color: var(--grey)
        }
    `

    protected render() {

        if (this.trips) {
            return repeat(this.trips, trip => trip.id, trip => html`
                <button @click="${() => this.onClick(trip)}">${datetime(trip.stopovers[0].departure, "time")}
                    ${trip.line.name}${trip.line.trainName ? html` <small>${trip.line.trainName}</small>` : nothing}<br>${trip.direction}
                </button>
            `)
        }

        return nothing
    }

    private onClick(trip: Trip) {
        this.dispatchEvent(new TripEvent('select', {trip: trip, bubbles: true, composed: true}))
    }
}