import {FavoritesState} from "./FavoritesState";
import {z} from "zod";
import {FavoriteTrip} from "./FavoriteTrip";
import {FavoriteStop} from "./FavoriteStop";

const key = 'favorites'

export class FavoritesStateStorage {

    constructor(private storage: Storage) {
    }

    public save(state: FavoritesState) {
        this.storage.setItem(key, JSON.stringify({
            trips: state.trips.items,
            stops: state.stops.items
        }))
    }

    public load(): FavoritesState {
        const json = this.storage.getItem(key);
        if (!json) {
            return new FavoritesState()
        }

        const data = JSON.parse(json)
        return new FavoritesState(
            z.array(FavoriteTrip).parse(data.trips),
            z.array(FavoriteStop).parse(data.stops)
        )
    }
}