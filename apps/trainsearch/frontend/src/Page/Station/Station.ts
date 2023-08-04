import {css, html, LitElement, nothing} from "lit";
import {customElement, state} from "lit/decorators.js";
import TrainSearchClient from "../../Client/TrainSearchClient";
import "../../Component/Common/SearchForm"
import {SearchSuggestion} from "../../Component/Common/SearchInput";
import {SearchFormEvent} from "../../Component/Common/SearchForm";
import {Trip} from "../../Models/Trip";
import '../../Component/Train/TripList'
import '../../Component/Train/TrainDetails'
import {TripEvent} from "../../Component/Train/TripList";
@customElement('ts-station')
class Station extends LitElement {
    private client = new TrainSearchClient(document.body.dataset.api)
    private abortController = new AbortController()

    @state()
    private suggestions: SearchSuggestion[] = []

    @state()
    private stationName: string = '';

    @state()
    private departures: Trip[] = []

    @state()
    private selected: Trip

    private uicPrefix: string
    private profile: string

    static styles = css`
        :host(ts-station) {
            display: flex;
            flex-direction: column;
        }
    `

    protected render() {
        return html`
            <ts-search-form .suggestions="${this.suggestions}" @suggest="${this.onSuggest}" @change="${this.onChange}"></ts-search-form>
            <h1>${this.stationName}</h1>
            <ts-trip-list .trips="${this.departures}" @select="${this.onSelect}"></ts-trip-list>
            ${this.renderSelected()}
        `
    }

    private renderSelected(){
        if (this.selected) {
            return html`<ts-details .trip="${this.selected}"></ts-details>`
        }
        return nothing;
    }

    private async onSelect(event: TripEvent)
    {
        this.selected = await this.client.tripdetails(event.trip.id, this.profile)
    }

    private async onSuggest(event: SearchFormEvent) {
        if (!event.value) {
            this.suggestions = []
            return;
        }
        if (!this.abortController.signal.aborted) {
            this.abortController.abort()
        }
        this.abortController = new AbortController()
        this.suggestions = await this.client.location(event.value, Number.parseInt(event.uicPrefix), event.profile, this.abortController)
    }

    private async onChange(event: SearchFormEvent)
    {
        this.selected = null;
        this.profile = event.profile
        this.uicPrefix = event.uicPrefix
        this.stationName = event.value
        this.departures = await this.client.departures(event.id, event.profile)
    }
}