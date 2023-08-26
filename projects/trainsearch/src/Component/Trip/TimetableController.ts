import {ReactiveController, ReactiveControllerHost} from "lit";
import {ClientInterface} from "../../Client/ClientInterface";
import {TimetableContextUpdater} from "../../ContextUpdater/TimetableContextUpdater";
import {TimetableContext} from "../../Context/TimetableContext";
import {Stopover} from "../../Models/Stopover";

export class TimetableController implements ReactiveController {
    private contextUpdater: TimetableContextUpdater
    private context: TimetableContext;

    constructor(private host: ReactiveControllerHost, private client: ClientInterface, profile: string, stopovers: Stopover[], stationId: string) {
        host.addController(this)
        this.contextUpdater = new TimetableContextUpdater(client)
        this.context = new TimetableContext(profile, stopovers, [], stationId);
        this.updateTimetable()
    }

    async updateTimetable() {
        this.context = await this.contextUpdater.update(this.context)
        this.host.requestUpdate()
    }

    get stopovers(): Stopover[] {
        return this.context.stopovers
    }

    public hasVehicleInfo(stopover: Stopover): boolean {
        return this.context.hasVehicleInfo(stopover)
    }

    displayVehicleInfo(stopover: Stopover): boolean {
        return this.context.displayVehicleInfo(stopover)
    }

    addDisplayVehicleInfo(stopover: Stopover) {
        this.context.addDisplayVehicleInfo(stopover)
        this.host.requestUpdate()
    }

    hostDisconnected() {
        this.client.abort()
    }
}