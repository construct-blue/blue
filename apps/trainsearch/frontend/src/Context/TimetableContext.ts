import {Stopover} from "../Models/Stopover";
import {Stop} from "../Models/Stop";

export class TimetableContext {
    private stopIdsWithVehicleInfo = new Set<string>;

    constructor(public profile: string, public stopovers: Stopover[], stopsWithVehicleInfo: Stop[]) {
        if (!profile) {
            throw 'Missing profile for TimetableContext'
        }
        this.stopIdsWithVehicleInfo = new Set<string>(stopsWithVehicleInfo.map(stop => stop.id))
    }

    public hasVehicleInfo(stopover: Stopover): boolean
    {
        return this.stopIdsWithVehicleInfo.has(stopover.stop.id)
    }
}