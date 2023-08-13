import {ReactiveController, ReactiveControllerHost} from "lit";
import {LocationBoardContext} from "../../Context/LocationBoardContext";
import {Location} from "../../Models/Location";
import {LocationBoardContextUpdater} from "../../ContextUpdater/LocationBoardContextUpdater";
import {ClientInterface} from "../../Client/ClientInterface";
import {Trip} from "../../Models/Trip";

export class LocationBoardController implements ReactiveController {
    private boardContext!: LocationBoardContext;
    private boardContextUpdater: LocationBoardContextUpdater

    constructor(private host: ReactiveControllerHost, private client: ClientInterface, profile: string, location: Location) {
        host.addController(this)
        this.boardContextUpdater = new LocationBoardContextUpdater(client)
        this.boardContext = new LocationBoardContext(profile, location, [])
        this.updateBoard()
    }

    public async updateBoard()
    {
        this.boardContext = await this.boardContextUpdater.update(this.boardContext)
        this.host.requestUpdate()
    }

    hostDisconnected() {
        this.client.abort()
    }

    get departures(): Trip[]
    {
        return this.boardContext.departures
    }
}