import {ReactiveController, ReactiveControllerHost} from "lit";
import TrainSearchClient from "../Client/TrainSearchClient";

export class TrainSearchController implements ReactiveController {
    private client = new TrainSearchClient('https://trainsearch-api.local')

    constructor(private host: ReactiveControllerHost) {
        host.addController(this)
    }

    public async trip(nr: string)
    {
        return await this.client.trip(nr)
    }

    hostUpdated() {
    }
}