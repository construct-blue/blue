import {ReactiveController, ReactiveControllerHost} from "lit";
import TrainSearchClient from "../../Client/TrainSearchClient";

export class TrainNumberController implements ReactiveController {
    private client = new TrainSearchClient(document.body.dataset.api)

    constructor(private host: ReactiveControllerHost) {
        host.addController(this)
    }

    public async trip(nr: string, operator: string, source: string)
    {
        return await this.client.trip(nr, operator, source)
    }

    public async operators(source: string)
    {
        return await this.client.operators(source)
    }

    public async composition(nr: string, stationId: string, source: string)
    {
        return await this.client.compostion(nr, stationId, source)
    }

    hostUpdated() {
    }
}