import {ReactiveController, ReactiveControllerHost} from "lit";
import TrainSearchClient from "./TrainSearchClient";
import {Favorites} from "../Models/Favorites";

export class TrainSearchController implements ReactiveController {
    private client = new TrainSearchClient(document.body.dataset.api ?? '')
    public favorites = Favorites.fromStorage(localStorage)

    private controllers: AbortController[] = [];

    constructor(private host: ReactiveControllerHost) {
        host.addController(this)
    }

    public async tripdetails(id: string, profile: string) {
        return await this.client.tripdetails(id, profile, this.getController())
    }

    public async tripsearch(nr: string, uicPrefix: number, profile: string, controller?: AbortController) {
        return await this.client.tripsearch(nr, uicPrefix, profile, this.getController(controller))
    }

    public async uicPrefixes(profile: string) {
        return await this.client.uicPrefixes(profile, this.getController())
    }

    public async composition(nr: string, stationId: string, date: string, source: string) {
        return await this.client.compostion(nr, stationId, date, source, this.getController())
    }

    public async stations(profile: string) {
        return await this.client.stations(profile, this.getController())
    }

    public async location(value: any, profile: any, controller?: AbortController) {
        return await this.client.location(value, profile, this.getController(controller))
    }

    public async departures(id: string, profile: string) {
        return await this.client.departures(id, profile, this.getController());
    }

    private getController(controller?: AbortController): AbortController {
        controller = controller ?? new AbortController()
        if (controller) {
            this.controllers.push(controller)
        }
        return controller as AbortController;
    }

    public abort() {
        this.controllers.forEach(controller => {
            if (!controller.signal.aborted) {
                controller.abort()
            }
        })
    }

    hostDisconnected() {
        this.abort()
    }
}