import {Stopover} from "../Models/Stopover";
import {Stop} from "../Models/Stop";

export class TimetableContext {
    constructor(public profile: string, public stopovers: Stopover[], public stopsWithVehicleInfo: Stop[]) {
        if (!profile) {
            throw 'Missing profile for TimetableContext'
        }
    }
}