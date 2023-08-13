import {ClientInterface} from "../../src/Client/ClientInterface";
import {Trip} from "../../src/Models/Trip";
import {Location} from "../../src/Models/Location";

export class TestClient implements ClientInterface {
    public aborted: boolean = false;

    constructor(private data: {
        departures: Trip[],
        trip: Trip,
        locationSearch: Location[]
    }) {
    }

    departures(profile: string, location: Location): Promise<Trip[]> {
        return Promise.resolve(this.data.departures)
    }

    trip(profile: string, id: string): Promise<Trip> {
        return Promise.resolve(this.data.trip)
    }

    locationSearch(profile: string, keyword: string): Promise<Location[]> {
        return Promise.resolve(this.data.locationSearch);
    }

    tripSearch(profile: string, uicPrefix: string, query: string): Promise<Trip[]> {
        return Promise.resolve([this.data.trip]);
    }

    abort() {
        this.aborted = true
    }
}