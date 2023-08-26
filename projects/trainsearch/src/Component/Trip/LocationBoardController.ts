import {ReactiveController, ReactiveControllerHost} from "lit";
import {LocationBoardContext} from "../../Context/LocationBoardContext";
import {Stop} from "../../Models/Stop";
import {LocationBoardContextUpdater} from "../../ContextUpdater/LocationBoardContextUpdater";
import {ClientInterface} from "../../Client/ClientInterface";
import {Trip} from "../../Models/Trip";
import {TripEvent} from "./TripList";
import {FavoritesState} from "../../Favorites/FavoritesState";
import {FavoritesStateStorage} from "../../Favorites/FavoritesStateStorage";

export class LocationBoardController implements ReactiveController {
    private boardContext!: LocationBoardContext;
    private boardContextUpdater: LocationBoardContextUpdater
    private favoritesState: FavoritesState
    private favoritesStateStorage = new FavoritesStateStorage(localStorage)

    public loading: boolean = false

    constructor(private host: ReactiveControllerHost, private client: ClientInterface, private profile: string, location: Stop) {
        host.addController(this)
        this.boardContextUpdater = new LocationBoardContextUpdater(client)
        this.boardContext = new LocationBoardContext(profile, location, [])
        this.favoritesState = this.favoritesStateStorage.load()
        this.updateBoard()
    }

    public async updateBoard() {
        this.boardContext = await this.boardContextUpdater.update(this.boardContext)
        this.loading = false
        this.host.requestUpdate()
    }

    hostDisconnected() {
        this.client.abort()
    }

    get departures(): Trip[] {
        return this.boardContext.departures
    }

    public onSelect(event: TripEvent) {
        this.boardContext.selectTrip(event.trip)
        this.host.requestUpdate()
        this.updateBoard()
    }

    public onRefresh() {
        this.loading = true
        this.host.requestUpdate()
        this.updateBoard()
    }

    public onBack() {
        this.boardContext.selectTrip(null)
        this.host.requestUpdate()
        this.updateBoard()
    }

    public onFavorite() {
        if (this.selectedTrip) {
            this.favoritesState.toggleTrip(this.profile, this.selectedTrip)
        } else {
            this.favoritesState.toggleStop(this.profile, this.boardContext.stop)
        }
        this.host.requestUpdate()
        this.favoritesStateStorage.save(this.favoritesState)
    }

    public isFavorite(): boolean {
        if (this.selectedTrip) {
            return this.favoritesState.hasTrip(this.profile, this.selectedTrip)
        } else {
            return this.favoritesState.hasStop(this.profile, this.boardContext.stop)
        }
    }

    get selectedTrip() {
        return this.boardContext.selectedTrip
    }
}