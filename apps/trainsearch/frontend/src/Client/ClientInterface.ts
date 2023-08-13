import {Location} from "../Models/Location";
import {Trip} from "../Models/Trip";

export interface ClientInterface {
    departures(profile: string, location: Location): Promise<Trip[]>;
    trip(profile: string, id: string): Promise<Trip>
    tripSearch(profile: string, uicPrefix: string, query: string): Promise<Trip[]>
    locationSearch(profile: string, keyword: string): Promise<Location[]>
    abort(): void
}