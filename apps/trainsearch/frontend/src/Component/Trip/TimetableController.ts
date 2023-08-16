import {ReactiveController, ReactiveControllerHost} from "lit";
import {ClientInterface} from "../../Client/ClientInterface";
import {TimetableContextUpdater} from "../../ContextUpdater/TimetableContextUpdater";
import {TimetableContext} from "../../Context/TimetableContext";
import {Stopover} from "../../Models/Stopover";

export class TimetableController implements ReactiveController {
    private contextUpdater: TimetableContextUpdater
    private context: TimetableContext = new TimetableContext('oebb', [], [])

    constructor(private host: ReactiveControllerHost, private client: ClientInterface) {
        host.addController(this)
        this.contextUpdater = new TimetableContextUpdater(client)
        this.updateTimetable()
    }

    async updateTimetable() {
        this.context = await this.contextUpdater.update(this.context)
    }

    get stopovers(): Stopover[] {
        return this.context.stopovers
    }

    set stopovers(stopovers: Stopover[]) {
        this.context.stopovers = stopovers;
    }

    public hasVehicleInfo(stopover: Stopover): boolean {
        return this.context.hasVehicleInfo(stopover)
    }

    hostDisconnected() {
        this.client.abort()
    }
}