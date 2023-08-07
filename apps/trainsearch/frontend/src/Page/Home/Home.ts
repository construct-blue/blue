import {css, html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import {Favorites} from "../../Models/Favorites";
import {Line, Trip} from "../../Models/Trip";
import {Location} from "../../Models/Location";
import '../../Component/Train/TripList'
import '../../Component/Train/TrainDetails'
import {TripEvent} from "../../Component/Train/TripList";
import {lineName} from "../../Directive/LineName";
import {TrainSearchController} from "../../Client/TrainSearchController";

@customElement('ts-home')
class Home extends LitElement {
    private favorites: Favorites = Favorites.fromStorage(localStorage)
    private controller = new TrainSearchController(this)

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

        small {
            color: var(--grey)
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
                <ts-details profile="${this.profile}" .trip="${this.trip}"
                            station-id="${this.stationIdMarked}">
                    <span>
                        <button @click="${this.onClickBackToLocation}">&larr; ${this.stationName ? this.stationName : 'Favoriten'}</button>
                        <span style="gap: .5rem">
                            ${this.renderFavoriteButton()}
                            <button @click="${this.onClickRefresh}">&circlearrowright;</button>
                        </span>
                    </span>
                </ts-details>
            `
        } else if (this.departures) {
            return html`
                <h1>${this.stationName}</h1>
                <span>
                    <button @click="${this.onClickBack}">&larr; Favoriten</button>
                    <span style="gap: .5rem">
                        ${this.renderFavoriteButton()}
                        <button @click="${this.onClickRefresh}">&circlearrowright;</button>
                    </span>
                </span>
                <ts-trip-list .trips="${this.departures}" @select="${this.onSelect}"></ts-trip-list>
            `
        } else {
            return html`
                <h1>&starf; Favoriten</h1>
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
            remarks: [],
            infos: [],
        }
        const trips = await this.controller.tripsearch(`${line.category} ${line.id}`, uicPrefix, profile)
        if (trips && trips.length) {
            this.trip = trips[0]
            this.trip = await this.controller.tripdetails(trips[0].id, profile)
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
        if (this.trip?.line) {
            if (this.favorites.hasLine(this.trip.line)) {
                return html`
                    <button @click="${() => this.onClickDeleteToFavorites()}" style="color: yellow">&starf;</button>`
            } else {
                return html`
                    <button @click="${() => this.onClickAddToFavorites()}" style="color: grey">&starf;</button>`
            }
        } else if (this.stationId) {
            if (this.favorites.hasLocation(this.stationId)) {
                return html`
                    <button @click="${() => this.onClickDeleteToFavorites()}" style="color: yellow">&starf;</button>`
            } else {
                return html`
                    <button @click="${() => this.onClickAddToFavorites()}" style="color: grey">&starf;</button>`
            }
        }
    }

    private onClickAddToFavorites() {

        if (this.trip?.line) {
            this.favorites.addLine(this.profile, Number.parseInt(this.trip.line.admin), this.trip.direction, this.trip.line)
        } else if (this.stationId) {
            this.favorites.addLocation({id: this.stationId, name: this.stationName, profile: this.profile})
        }

        this.favorites.save(localStorage)
        this.requestUpdate()
    }

    private onClickDeleteToFavorites() {
        if (this.trip?.line) {
            this.favorites.deleteLine(this.trip.line)
        } else if (this.stationId) {
            this.favorites.deleteLocation(this.stationId)
        }

        this.favorites.save(localStorage)
        this.requestUpdate()
    }


    private async onSelect(event: TripEvent) {
        this.trip = event.trip;
        this.stationIdMarked = event.trip.stopovers[0].stop.id
        this.trip = await this.controller.tripdetails(event.trip.id, this.profile)
    }

    private onClickBackToLocation() {
        this.trip = null
        this.controller.abort()
    }

    private onClickBack() {
        this.departures = null
        this.stationName = null
        this.stationId = null
        this.stationIdMarked = null
        this.profile = null
        this.controller.abort()
    }

    private async onClickLocation(location: Location) {
        this.profile = location.profile
        this.stationId = location.id
        this.stationName = location.name
        this.departures = []
        this.departures = await this.controller.departures(location.id, location.profile)
    }

    private async onClickRefresh() {
        if (this.trip) {
            this.controller.abort()
            this.trip = await this.controller.tripdetails(this.trip.id, this.profile)
        } else if (this.stationId && this.profile) {
            this.controller.abort()
            this.departures = await this.controller.departures(this.stationId, this.profile)
        }
    }
}