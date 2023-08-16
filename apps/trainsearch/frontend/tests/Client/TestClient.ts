import {ClientInterface} from "../../src/Client/ClientInterface";
import {Trip} from "../../src/Models/Trip";
import {Stop} from "../../src/Models/Stop";

export class TestClient implements ClientInterface {
    public aborted: boolean = false;

    constructor(private data: {
        departures: Trip[],
        trip: Trip,
        stops: Stop[]
    }) {
    }

    departures(profile: string, location: Stop): Promise<Trip[]> {
        return Promise.resolve(this.data.departures)
    }

    trip(profile: string, id: string): Promise<Trip> {
        return Promise.resolve(this.data.trip)
    }

    locationSearch(profile: string, keyword: string): Promise<Stop[]> {
        return Promise.resolve(this.data.stops);
    }

    tripSearch(profile: string, uicPrefix: string, query: string): Promise<Trip[]> {
        return Promise.resolve([this.data.trip]);
    }

    stopsWithVehicleInfo(profile: string): Promise<Stop[]> {
        return Promise.resolve(this.data.stops)
    }

    abort() {
        this.aborted = true
    }
}