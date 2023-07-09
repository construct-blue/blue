import {ReactiveController, ReactiveControllerHost} from "lit";
import TrainSearchClient from "../../Client/TrainSearchClient";

export class TrainNumberController implements ReactiveController {
    private client = new TrainSearchClient(document.body.dataset.api)

    constructor(private host: ReactiveControllerHost) {
        host.addController(this)
    }

    public async trip(nr: string, uicPrefix: number, profile: string)
    {
        return await this.client.trip(nr, uicPrefix, profile)
    }

    public async tripdetails(id: string, profile: string)
    {
        return await this.client.tripdetails(id, profile)
    }

    public async tripsearch(nr: string, uicPrefix: number, profile: string, controller: AbortController)
    {
        return await this.client.tripsearch(nr, uicPrefix, profile, controller)
    }

    public async operators(profile: string)
    {
        return await this.client.operators(profile)
    }

    public async uicPrefixes(profile: string)
    {
        return await this.client.uicPrefixes(profile)
    }

    public async composition(nr: string, stationId: string, source: string)
    {
        return await this.client.compostion(nr, stationId, source)
    }

    hostUpdated() {
    }
}