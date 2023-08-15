import {Stop} from "../Models/Stop";
import {Trip} from "../Models/Trip";

export class LocationBoardContext {
    private _selectedTrip: Trip|null = null;

    constructor(public profile: string, public location: Stop, public departures: Trip[]) {
        if (!profile) {
            throw 'Missing profile for LocationBoardContext'
        }
        if (!location || !location.id || !location.name) {
            throw 'Missing location for LocationBoardContext'
        }
    }

    get name() {
        return this.location.name
    }

    get id() {
        return this.location.id
    }

    get selectedTrip(): Trip|null {
        return this._selectedTrip;
    }

    selectTrip(trip: Trip|null) {
        if (undefined === trip) {
            trip = null
        }
        this._selectedTrip = trip
    }
}