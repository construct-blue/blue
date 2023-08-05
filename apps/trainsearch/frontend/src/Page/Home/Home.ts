import {css, html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import {Favorites} from "../../Models/Favorites";
import TrainSearchClient from "../../Client/TrainSearchClient";
import {Trip} from "../../Models/Trip";
import {Location} from "../../Models/Location";
import '../../Component/Train/TripList'
import '../../Component/Train/TrainDetails'
import {TripEvent} from "../../Component/Train/TripList";

@customElement('ts-home')
class Home extends LitElement {
    private favorites: Favorites = Favorites.fromStorage(localStorage)
    private client = new TrainSearchClient(document.body.dataset.api)

    @state()
    private stationName: string

    @state()
    private stationId: string

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

        div {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            overflow: scroll;
            padding: .5rem 0;
        }

        button {
            font-size: 1rem;
            background: var(--dark-grey);
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .5rem;
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
                    <button @click="${this.onClickBackToLocation}">&larr; ${this.stationName}</button>
                </span>
                <ts-details profile="${this.profile}" .trip="${this.trip}"></ts-details>
            `
        } else if (this.departures) {
            return html`
                <h1>${this.stationName}</h1>
                <span>
                    <button @click="${this.onClickBack}">&larr; Zurück</button>
                                    ${this.renderFavoriteButton()}
                </span>
                <ts-trip-list .trips="${this.departures}" @select="${this.onSelect}"></ts-trip-list>
            `
        } else {
            return html`
                <h1>Favoriten</h1>
                <div>
                    ${this.favorites.locations.map(location => html`
                        <button @click="${() => this.onClickLocation(location)}">
                            ${location.name} (${location.profile})
                        </button>
                    `)}
                </div>
            `
        }
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
        this.trip = null;
        this.trip = await this.client.tripdetails(event.trip.id, this.profile)
    }

    private onClickBackToLocation() {
        this.trip = null
    }

    private onClickBack() {
        this.departures = null
        this.stationName = null
        this.stationId = null
        this.profile = null
    }

    private async onClickLocation(location: Location) {
        this.profile = location.profile
        this.stationId = location.id
        this.stationName = location.name
        this.departures = await this.client.departures(location.id, location.profile)
    }
}