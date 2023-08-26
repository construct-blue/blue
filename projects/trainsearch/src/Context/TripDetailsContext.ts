import {Trip} from "../Models/Trip";

export class TripDetailsContext {
    constructor(public profile: string, public trip: Trip) {
        if (!profile) {
            throw 'Missing profile for TripDetailsContext'
        }

        if (!trip.id) {
            throw 'Invalid trip for TripDetailsContext'
        }
    }

    get id() {
        return this.trip.id
    }
}