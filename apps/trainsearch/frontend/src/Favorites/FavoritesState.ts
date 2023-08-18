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

    toggleTrip(profile: string, trip: Trip) {
        const favoriteTrip = createTrip(trip, profile);
        if (this.trips.has(favoriteTrip)) {
            this.trips = this.trips.without(favoriteTrip)
        } else {
            this.trips = this.trips.with(favoriteTrip)
        }
    }

    toggleStop(profile: string, stop: Stop) {
        const favoriteStop = createStop(stop, profile)
        if (this.stops.has(favoriteStop)) {
            this.stops = this.stops.without(favoriteStop)
        } else {
            this.stops = this.stops.with(favoriteStop)
        }
    }

    hasTrip(profile: string, trip: Trip) {
        return this.trips.has(createTrip(trip, profile))
    }

    hasStop(profile: string, stop: Stop) {
        return this.stops.has(createStop(stop, profile))
    }
}
