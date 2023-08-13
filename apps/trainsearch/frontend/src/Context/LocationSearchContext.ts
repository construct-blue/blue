import {Location} from "../Models/Location";

export class LocationSearchContext {

    constructor(public profile: string, public keyword: string, public locations: Location[]) {
        if (!profile) {
            throw 'Missing profile for LocationSearchContext'
        }
    }
}