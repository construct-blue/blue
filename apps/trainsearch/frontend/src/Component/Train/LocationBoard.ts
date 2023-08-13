import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {Location} from "../../Models/Location";
import {Trip} from "../../Models/Trip";
import './TripList'
import './TrainDetails'
import '../Common/ReloadButton'
import {TrainSearchController} from "../../Client/TrainSearchController";
import {TripEvent} from "./TripList";
import {LocationBoardController} from "./LocationBoardController";
import {Client} from "../../Client/Client";

@customElement('ts-location-board')
class LocationBoard extends LitElement {
    @property({type: Object})
    public location!: Location

    @property({type: String})
    public profile!: string;

    private controller!: LocationBoardController

    connectedCallback() {
        super.connectedCallback();
        this.controller = new LocationBoardController(
                this,
                new Client(document.body.dataset.api ?? ''),
                this.profile,
                this.location
        )
    }

    private tsController = new TrainSearchController(this)


    @state()
    private trips: Trip[] = []

    @state()
    private selected: Trip | null = null

    @state()
    private loading: boolean = false

    @state()
    private locationIdMarked: string = ''

    static styles = css`

    `

    protected render() {
        if (this.selected) {
            return this.renderTrainDetails(this.selected);
        }
        if (this.trips) {
            return this.renderTripList(this.trips);
        }
        return nothing;
    }

    private renderTripList(trips: Trip[]) {
        return html`
            <h1>${this.location?.name}</h1>
            <span>
                <slot></slot>
                <span style="gap: .5rem">
                    ${this.renderFavoriteButton()}
                    <ts-reload-button ?loading="${this.loading}"
                                      @click="${this.onClickRefresh}"></ts-reload-button>
                </span>
            </span>
            <ts-trip-list .trips="${this.controller.departures}" @select="${this.onSelectTrip}"></ts-trip-list>
        `
    }

    private renderTrainDetails(selected: Trip) {
        return html`
            <ts-details .trip="${selected}" profile="${this.profile}">
                <span>
                    <button @click="${this.onClickBackToLocation}">&larr; ${this.location?.name ? this.location.name : 'Zurück'}</button>
                    <span style="gap: .5rem">
                        ${this.renderFavoriteButton()}
                        <ts-reload-button ?loading="${this.loading}"
                                          @click="${this.onClickRefresh}"></ts-reload-button>
                    </span>
                </span>
            </ts-details>
        `
    }

    private renderFavoriteButton() {
        const favorites = this.tsController.favorites

        if (this.selected && favorites.hasLine(this.selected.line) || this.location && favorites.hasLocation(this.location.id)) {
            return html`
                <button @click="${() => this.onClickDeleteToFavorites()}" style="color: yellow">&starf;</button>`
        } else {
            return html`
                <button @click="${() => this.onClickAddToFavorites()}" style="color: grey">&starf;</button>`
        }
    }

    private onClickAddToFavorites() {

        const favorites = this.tsController.favorites;

        if (this.selected?.line) {
            favorites.addLine(this.profile, Number.parseInt(this.selected.line.admin), this.selected.direction, this.selected.line)
        } else if (this.location?.id) {
            favorites.addLocation(this.location)
        }

        favorites.save(localStorage)
        this.requestUpdate()
    }

    private onClickDeleteToFavorites() {
        const favorites = this.tsController.favorites;

        if (this.selected?.line) {
            favorites.deleteLine(this.selected.line)
        } else if (this.location?.id) {
            favorites.deleteLocation(this.location.id)
        }

        favorites.save(localStorage)
        this.requestUpdate()
    }


    private async onClickRefresh() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        if (this.selected?.id) {
            this.tsController.abort()
            const trip = await this.tsController.tripdetails(this.selected.id, this.profile);
            if (trip) {
                this.selected = trip;
            }
        } else if (this.location?.id && this.profile) {
            this.tsController.abort()
            const departures = await this.tsController.departures(this.location.id, this.profile);
            if (departures) {
                this.trips = departures
            }
        }
        this.loading = false;
    }

    private async onSelectTrip(event: TripEvent) {
        this.selected = event.trip;
        this.locationIdMarked = event.trip?.stopovers[0].stop.id ?? ''
        const trip = await this.tsController.tripdetails(event.trip?.id ?? '', this.profile)
        if (trip) {
            this.selected = trip
        }
    }

    private onClickBackToLocation() {
        this.selected = null
        this.tsController.abort()
    }
}