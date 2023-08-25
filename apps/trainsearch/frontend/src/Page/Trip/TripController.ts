import {ReactiveController, ReactiveControllerHost} from "lit";
import {SearchFormEvent} from "../../Component/Common/SearchForm";
import {TripSearchContext} from "../../Context/TripSearchContext";
import {UicPrefix} from "../../Models/UicPrefix";
import {Client} from "../../Client/Client";

export class TripController implements ReactiveController {
    private searchContext = new TripSearchContext('oebb', '81', '', [])
    private client: Client = new Client(document.body.dataset.api ?? '')

    constructor(host: ReactiveControllerHost) {
        host.addController(this)
    }

    hostConnected() {
    }

    onSuggest(event: SearchFormEvent) {

    }

    onChange(event: SearchFormEvent) {

    }

    get profile() {
        return this.searchContext.profile
    }

    get uicPrefix() {
        return this.searchContext.uicPrefix
    }

    get keyword() {
        return this.searchContext.query
    }

    get suggestions() {
        return this.searchContext.trips
    }

    async loadUicPrefixes(): Promise<UicPrefix[]> {
        try {

            return await this.client.uicPrefixes(this.profile)
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}