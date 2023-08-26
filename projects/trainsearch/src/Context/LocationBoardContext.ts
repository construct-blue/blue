import {Stop} from "../Models/Stop";
import {Trip} from "../Models/Trip";

export class LocationBoardContext {
    private _selectedTrip: Trip|null = null;

    constructor(public profile: string, public stop: Stop, public departures: Trip[]) {
        if (!profile) {
            throw 'Missing profile for LocationBoardContext'
        }
        if (!stop || !stop.id || !stop.name) {
            throw 'Missing stop for LocationBoardContext'
        }
    }

    get name() {
        return this.stop.name
    }

    get id() {
        return this.stop.id
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