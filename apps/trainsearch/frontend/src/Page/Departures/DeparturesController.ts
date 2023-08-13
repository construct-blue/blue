import {ReactiveController, ReactiveControllerHost} from "lit";
import {SearchFormEvent} from "../../Component/Common/SearchForm";
import {Location} from "../../Models/Location";
import {LocationSearchContext} from "../../Context/LocationSearchContext";
import {LocationSearchContextUpdater} from "../../ContextUpdater/LocationSearchContextUpdater";
import {DeparturesState} from "./DeparturesState";
import {StateController} from "@lit-app/state/src/state-controller";
import {ClientInterface} from "../../Client/ClientInterface";

export class DeparturesController implements ReactiveController {
    private searchContextUpdater
    private searchContext: LocationSearchContext

    constructor(private host: ReactiveControllerHost, private client: ClientInterface, private state: DeparturesState) {
        host.addController(this)
        new StateController(host, state)
        this.searchContextUpdater = new LocationSearchContextUpdater(client)
        this.searchContext = this.createSearchContext(state)
    }

    private createSearchContext(state: DeparturesState) {
        return new LocationSearchContext(state.profile, state.keyword, [])
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

    public onSuggest(event: SearchFormEvent) {
        this.state.profile = event.profile
        this.state.keyword = event.value
        this.searchContext = this.createSearchContext(this.state)
        this.updateSearch()
    }

    public onChange(event: SearchFormEvent) {
        if (event.id && event.value) {
            this.state.location = {
                id: event.id,
                name: event.value
            };
            this.host.requestUpdate()
        }
    }

    public onBack() {

    }

    get suggestions() {
        return this.searchContext.locations;
    }

    get keyword() {
        return this.state.keyword;
    }

    get profile() {
        return this.state.profile;
    }

    get location(): Location | null {
        return this.state.location
    }
}
