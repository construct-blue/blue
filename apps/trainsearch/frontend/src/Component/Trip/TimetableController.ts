import {ReactiveController, ReactiveControllerHost} from "lit";
import {Client} from "../../Client/Client";
import {ClientInterface} from "../../Client/ClientInterface";

export class TimetableController implements ReactiveController {


    constructor(private host: ReactiveControllerHost, private client: ClientInterface) {
        host.addController(this)
    }

    hostConnected() {

    }
}