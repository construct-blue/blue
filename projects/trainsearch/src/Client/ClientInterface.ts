import {Stop} from "../Models/Stop";
import {Trip} from "../Models/Trip";
import {UicPrefix} from "../Models/UicPrefix";

export interface ClientInterface {
    departures(profile: string, location: Stop): Promise<Trip[]>;
    trip(profile: string, id: string): Promise<Trip>
    tripSearch(profile: string, uicPrefix: string, query: string): Promise<Trip[]>
    locationSearch(profile: string, keyword: string): Promise<Stop[]>
    stopsWithVehicleInfo(profile: string): Promise<Stop[]>
    uicPrefixes(profile: string): Promise<UicPrefix[]>;
    abort(): void
}