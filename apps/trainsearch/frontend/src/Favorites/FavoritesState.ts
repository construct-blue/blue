import {State} from "@lit-app/state/src/state.js";
import {property} from "@lit-app/state/src/decorators/property.js";
import {storage} from "@lit-app/state/src/decorators/storage.js";
import {FavoriteStop} from "./FavoriteStop";
import {FavoriteTrip} from "./FavoriteTrip";
import {Trip} from "../Models/Trip";
import {Stop} from "../Models/Stop";

export class FavoritesState extends State {
    @storage({prefix: 'stops', key: 'favorites'})
    @property({type: Object, value: []})
    public stops!: FavoriteStop[]

    @storage({prefix: 'trips', key: 'favorites'})
    @property({type: Object, value: []})
    public trips!: FavoriteTrip[]

    addTrip(profile: string, trip: Trip) {
        this.trips = [...this.trips, {
            ...trip,
            profile: profile,
        }]
    }

    addStop(profile: string, stop: Stop) {
        this.stops = [...this.stops, {
            ...stop,
            profile: profile
        }]
    }

    hasTrip(profile: string, trip: Trip) {
        for (const t of this.trips) {
            if (t.profile === profile
                    && t.line.operator.id === trip.line.operator.id
                    && t.line.product.id === trip.line.product.id
                    && t.line.category === trip.line.category
                    && t.line.id === trip.line.id
                    && t.line.number === trip.line.number
                    && t.line.admin === trip.line.admin
            ) {
                return true;
            }
        }
        return false;
    }

    hasStop(profile: string, stop: Stop) {
        for (const s of this.stops) {
            if (s.profile === profile && s.id === stop.id) {
                return true;
            }
        }

        return false;
    }
}

export const favoritesState = new FavoritesState();