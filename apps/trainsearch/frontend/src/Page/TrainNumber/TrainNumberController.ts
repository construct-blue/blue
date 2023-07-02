import {ReactiveController, ReactiveControllerHost} from "lit";
import TrainSearchClient from "../../Client/TrainSearchClient";

export class TrainNumberController implements ReactiveController {
    private client = new TrainSearchClient(document.body.dataset.api)

    constructor(private host: ReactiveControllerHost) {
        host.addController(this)
    }

    public async trip(nr: string, operator: string)
    {
        return await this.client.trip(nr, operator)
    }

    public async operators()
    {
        return await this.client.operators()
    }

    hostUpdated() {
    }
}