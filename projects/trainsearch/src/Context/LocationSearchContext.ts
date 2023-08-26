import {Stop} from "../Models/Stop";

export class LocationSearchContext {

    constructor(public profile: string, public keyword: string, public stops: Stop[]) {
        if (!profile) {
            throw 'Missing profile for LocationSearchContext'
        }
    }
}