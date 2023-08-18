import {create as createStop, equals, FavoriteStop} from "./FavoriteStop";
import {create as createTrip, FavoriteTrip, similar} from "./FavoriteTrip";
import {Trip} from "../Models/Trip";
import {Stop} from "../Models/Stop";
import {ImmutableList} from "./ImmutableList";

export class FavoritesState {
    public stops: ImmutableList<FavoriteStop>

    public trips: ImmutableList<FavoriteTrip>

    constructor(trips: FavoriteTrip[] = [], stops: FavoriteStop[] = []) {
        this.trips = new ImmutableList<FavoriteTrip>(similar, trips)
        this.stops = new ImmutableList<FavoriteStop>(equals, stops)
    }

    addTrip(profile: string, trip: Trip) {
        this.trips = this.trips.with(createTrip(trip, profile))
    }

    addStop(profile: string, stop: Stop) {
        this.stops = this.stops.with(createStop(stop, profile))
    }

    hasTrip(profile: string, trip: Trip) {
        return this.trips.has(createTrip(trip, profile))
    }

    hasStop(profile: string, stop: Stop) {
        return this.stops.has(createStop(stop, profile))
    }
}
