import {css, html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import {Favorites} from "../../Models/Favorites";
import TrainSearchClient from "../../Client/TrainSearchClient";
import {Line, Trip} from "../../Models/Trip";
import {Location} from "../../Models/Location";
import '../../Component/Train/TripList'
import '../../Component/Train/TrainDetails'
import {TripEvent} from "../../Component/Train/TripList";
import {lineName} from "../../Directive/LineName";

@customElement('ts-home')
class Home extends LitElement {
    private favorites: Favorites = Favorites.fromStorage(localStorage)
    private client = new TrainSearchClient(document.body.dataset.api)

    @state()
    private stationName: string

    @state()
    private stationId: string

    @state()
    private stationIdMarked: string

    @state()
    private profile: string

    @state()
    private departures: Trip[] = null

    @state()
    private trip: Trip = null

    static styles = css`
      :host(ts-home) {
        display: flex;
        flex-direction: column;
        gap: .5rem;
      }

      h1 {
        margin: .5rem 0;
      }

      h2 {
        display: flex;
        margin: .25rem 0;
      }

      i {
        width: 2rem;
      }

      div {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        overflow: scroll;
        padding: .5rem 0;
      }

      button {
        display: flex;
        font-size: 1rem;
        text-align: left;
        background: var(--dark-grey);
        border: none;
        color: #fff;
        border-radius: 4px;
        padding: .5rem;
      }

      i {
        width: 2rem;
        align-self: end;
        text-align: center;
      }

      span {
        display: flex;
        justify-content: space-between;
      }
    `

    connectedCallback() {
        super.connectedCallback();
        if (this.favorites.isEmpty()) {
            window.location.href = '/train'
        }
    }

    protected render() {
        if (this.trip) {
            return html`
                <span>
                    <button @click="${this.onClickBackToLocation}">&larr; ${this.stationName ? this.stationName : 'Favoriten'}</button>
                </span>
                <ts-details profile="${this.profile}" .trip="${this.trip}" station-id="${this.stationIdMarked}"></ts-details>
            `
        } else if (this.departures) {
            return html`
                <h1>${this.stationName}</h1>
                <span>
                    <button @click="${this.onClickBack}">&larr; Favoriten</button>
                                    ${this.renderFavoriteButton()}
                </span>
                <ts-trip-list .trips="${this.departures}" @select="${this.onSelect}"></ts-trip-list>
            `
        } else {
            return html`
                <h1><i style="font-family: oebb-symbols">Ð</i> Favoriten</h1>
                <div>
                    <h2><i style="font-family: mav-symbols">ȫ</i>&nbsp;Abfahrten</h2>
                    ${this.favorites.locations.map(location => html`
                        <button @click="${() => this.onClickLocation(location)}">
                            ${this.formatProfile(location.profile)}&nbsp;${location.name}
                        </button>
                    `)}
                    <h2><i style="font-family: oebb-symbols">–</i>&nbsp;Züge</h2>
                    ${this.favorites.lines.map(line => html`
                        <button @click="${() => this.onClickLine(line.line, line.profile, line.direction, line.uicPrefix)}">
                            ${this.formatProfile(line.profile)}&nbsp;${lineName(line.line)}&nbsp;&rarr;&nbsp;${line.direction}
                        </button>
                    `)}
                </div>
            `
        }
    }

    private async onClickLine(line: Line, profile: string, direction: string, uicPrefix: number) {
        this.profile = profile
        this.trip = {
            line: line,
            direction: direction,
            stopovers: [],
            id: '',
            date: '',
            foreign: null,
            remarks: []
        }
        const trips = await this.client.tripsearch(`${line.category} ${line.id}`, uicPrefix, profile, new AbortController())
        if (trips.length) {
            this.trip = trips[0]
            this.trip = await this.client.tripdetails(trips[0].id, profile)
        }
    }

    private formatProfile(profile: string) {
        if (profile === 'oebb') {
            return html`<i style="font-family: oebb-light-symbols">o</i>`
        }

        if (profile === 'db') {
            return html`<i style="font-family: oebb-light-symbols">ø</i>`
        }

        return `(${profile})`;
    }

    private renderFavoriteButton() {
        if (this.stationId) {
            if (this.favorites.hasLocation(this.stationId)) {
                return html`
                    <button @click="${() => this.onClickDeleteToFavorites()}">Aus Favoriten löschen</button>`
            } else {
                return html`
                    <button @click="${() => this.onClickAddToFavorites()}">Zu Favoriten hinzufügen</button>`
            }
        }
    }

    private onClickAddToFavorites() {
        this.favorites.addLocation({id: this.stationId, name: this.stationName, profile: this.profile})
        this.favorites.save(localStorage)
        this.requestUpdate()
    }

    private onClickDeleteToFavorites() {
        this.favorites.deleteLocation(this.stationId)
        this.favorites.save(localStorage)
        this.requestUpdate()
    }


    private async onSelect(event: TripEvent) {
        this.trip = event.trip;
        this.stationIdMarked = event.trip.stopovers[0].stop.id
        this.trip = await this.client.tripdetails(event.trip.id, this.profile)
    }

    private onClickBackToLocation() {
        this.trip = null
    }

    private onClickBack() {
        this.departures = null
        this.stationName = null
        this.stationId = null
        this.stationIdMarked = null
        this.profile = null
    }

    private async onClickLocation(location: Location) {
        this.profile = location.profile
        this.stationId = location.id
        this.stationName = location.name
        this.departures = []
        this.departures = await this.client.departures(location.id, location.profile)
    }
}