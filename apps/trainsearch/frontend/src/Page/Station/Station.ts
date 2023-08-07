import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement, state} from "lit/decorators.js";
import TrainSearchClient from "../../Client/TrainSearchClient";
import "../../Component/Common/SearchForm"
import {SearchSuggestion} from "../../Component/Common/SearchInput";
import {SearchFormEvent} from "../../Component/Common/SearchForm";
import {Trip} from "../../Models/Trip";
import '../../Component/Train/TripList'
import '../../Component/Train/TrainDetails'
import {TripEvent} from "../../Component/Train/TripList";
import {Favorites} from "../../Models/Favorites";
import {State, property, query, storage} from "@lit-app/state";
import {StateController} from "@lit-app/state/src/state-controller.js";
import {TrainSearchController} from "../../Client/TrainSearchController";

class StationState extends State {
    @query({parameter: 'value'})
    @storage({key: 'value', prefix: 'departure'})
    @property({value: ''})
    value: string

    @query({parameter: 'profile'})
    @storage({key: 'profile', prefix: 'departure'})
    @property({value: 'oebb'})
    profile: string

    @query({parameter: 'uicPrefix'})
    @storage({key: 'uicPrefix', prefix: 'departure'})
    @property({value: '81'})
    uicPrefix: string
}

const stationState = new StationState();

@customElement('ts-station')
class Station extends LitElement {
    private stateController = new StateController(this, stationState)
    private controller = new TrainSearchController(this)
    private favorites = Favorites.fromStorage(localStorage)

    @state()
    private suggestions: SearchSuggestion[] = []

    @state()
    private stationName: string = '';

    @state()
    public stationId: string;

    @state()
    public stationIdMarked: string;

    @state()
    private departures: Trip[] = []

    @state()
    private selected: Trip

    @state()
    private profile: string

    static styles = css`
        :host(ts-station) {
            display: flex;
            flex-direction: column;
        }

        h1 {
            margin: .5rem 0;
        }

        button {
            font-size: 1rem;
            background: var(--dark-grey);
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .25rem;
        }
    `

    protected render() {
        return html`
            <h1><i style="font-family: mav-symbols">ȫ</i> Abfahrten</h1>
            <ts-search-form .suggestions="${this.suggestions}" @suggest="${this.onSuggest}"
                            @change="${this.onChange}"
                            .value="${stationState.value}"
                            .uicPrefix="${stationState.uicPrefix}"
                            .profile="${stationState.profile}"
            ></ts-search-form>
            ${this.selected ?
                    html`
                        <h1>
                            <button @click="${this.onClickBack}">&larr; ${this.stationName}</button>
                        </h1>` :
                    html`<h1>${this.stationName}</h1>`
            }

            ${this.renderSelected()}
        `
    }

    private renderSelected() {
        if (this.selected) {
            return html`
                <ts-details profile="${stationState.profile}" .trip="${this.selected}" station-id="${this.stationIdMarked}"></ts-details>`
        } else {
            return html`
                <div>
                    ${this.renderFavoriteButton()}
                    ${this.stationId ? html`
                        <button @click="${this.onClickRefresh}">Aktualisieren</button>` : nothing}
                </div>
                <ts-trip-list .trips="${this.departures}" @select="${this.onSelect}"></ts-trip-list>
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

    private onClickBack()
    {
        this.selected = null
        this.controller.abort()
    }

    private onClickAddToFavorites() {
        this.favorites.addLocation({id: this.stationId, name: this.stationName, profile: stationState.profile})
        this.favorites.save(localStorage)
        this.requestUpdate()
    }

    private onClickDeleteToFavorites() {
        this.favorites.deleteLocation(this.stationId)
        this.favorites.save(localStorage)
        this.requestUpdate()
    }

    private async onSelect(event: TripEvent) {
        this.selected = event.trip;
        this.stationIdMarked = event.trip.stopovers[0].stop.id
        this.selected = await this.controller.tripdetails(event.trip.id, stationState.profile)
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if (stationState.value) {
            this.refreshSuggestions()
        }
    }

    private async onSuggest(event: SearchFormEvent) {
        stationState.value = event.value
        stationState.profile = event.profile
        await this.refreshSuggestions()
    }

    private async refreshSuggestions() {
        this.suggestions = []
        if (!stationState.value) {
            this.departures = null
            this.stationName = null
            this.stationId = null
            this.stationIdMarked = null
            this.selected = null
            this.profile = null
            return;
        }

        this.controller.abort()
        this.suggestions = await this.controller.location(stationState.value, stationState.profile)
    }

    private async onChange(event: SearchFormEvent) {
        this.controller.abort()
        this.selected = null;
        this.departures = null;
        this.stationName = event.value
        this.stationId = event.id
        this.profile = event.profile
        this.departures = await this.controller.departures(event.id, event.profile)
    }

    private async onClickRefresh()
    {
        if (this.stationId && this.profile) {
            this.controller.abort()
            this.departures = await this.controller.departures(this.stationId, this.profile)
        }
    }
}