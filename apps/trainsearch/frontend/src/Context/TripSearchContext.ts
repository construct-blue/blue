import {Trip} from "../Models/Trip";

export class TripSearchContext {
    private _trips: Trip[]

    constructor(public profile: string, public query: string, trips: Trip[]) {
        if (!profile) {
            throw 'Missing profile for TripSearchContext'
        }
        this._trips = trips
    }

    get trips(): Trip[] {
        if (!this.query) {
            return [];
        }
        return this._trips
    }
}