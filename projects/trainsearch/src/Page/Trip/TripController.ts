import {ReactiveController, ReactiveControllerHost} from "lit";
import {SearchFormEvent, SearchFormSuggestEvent} from "../../Component/Common/SearchForm";
import {TripSearchContext} from "../../Context/TripSearchContext";
import {UicPrefix} from "../../Models/UicPrefix";
import {TripSearchContextUpdater} from "../../ContextUpdater/TripSearchContextUpdater";
import {ClientInterface} from "../../Client/ClientInterface";
import {TripState} from "./TripState";
import {Trip} from "../../Models/Trip";

export class TripController implements ReactiveController {
    private searchContextUpdater: TripSearchContextUpdater
    private searchContext: TripSearchContext

    constructor(private host: ReactiveControllerHost, private client: ClientInterface, private state: TripState) {
        host.addController(this)
        this.searchContextUpdater = new TripSearchContextUpdater(client)
        this.searchContext = this.createSearchContext(state)
    }

    private createSearchContext(state: TripState) {
        return new TripSearchContext(state.profile, state.uicPrefix.toString(), state.query, [])
    }


    hostConnected() {
        this.updateSearch()
    }

    hostDisconnected() {
        this.client.abort()
    }

    private async updateSearch() {
        this.searchContext = await this.searchContextUpdater.update(this.searchContext);
        this.host.requestUpdate()
    }

    onSuggest(event: SearchFormSuggestEvent) {
        this.state.profile = event.profile
        this.state.uicPrefix = Number.parseInt(event.uicPrefix)
        this.state.query = event.value
        this.searchContext = this.createSearchContext(this.state)
        this.host.requestUpdate()
        this.updateSearch()
    }

    onChange(event: SearchFormEvent<Trip>) {
        if (event.value) {
            this.state.trip = event.value;
            this.host.requestUpdate()
        }
    }

    get profile() {
        return this.state.profile
    }

    get uicPrefix() {
        return this.state.uicPrefix
    }

    get keyword() {
        return this.state.query
    }

    get suggestions() {
        return this.searchContext.trips.map(trip => {
            return {
                id: trip.id,
                name: trip.line.name,
                value: trip
            }
        })
    }

    async loadUicPrefixes(): Promise<UicPrefix[]> {
        return await this.client.uicPrefixes(this.profile)
    }
}