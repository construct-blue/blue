import {Trip} from "../Models/Trip";

export class TripSearchContext {

    constructor(public profile: string, public uicPrefix: string, public query: string, public trips: Trip[]) {
        if (!profile) {
            throw 'Missing profile for TripSearchContext'
        }
        if (!uicPrefix) {
            throw 'Missing uicPrefix for TripSearchContext'
        }
    }
}