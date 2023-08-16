import {Stopover} from "../Models/Stopover";
import {Stop} from "../Models/Stop";

export class TimetableContext {
    private stopIdsWithVehicleInfo = new Set<string>
    private stopIdsThatDisplayVehicleInfo = new Set<string>

    constructor(public profile: string, public stopovers: Stopover[], stopsWithVehicleInfo: Stop[]) {
        if (!profile) {
            throw 'Missing profile for TimetableContext'
        }

        stopsWithVehicleInfo = stopsWithVehicleInfo.slice(0, stopsWithVehicleInfo.length - 1)
        this.stopIdsWithVehicleInfo = new Set<string>(stopsWithVehicleInfo.map(stop => stop.id))
        stopovers.forEach(stopover => {
            if (!this.hasVehicleInfo(stopover)) {
                return;
            }
            if (this.stopIdsThatDisplayVehicleInfo.size === 0 || stopover.changedLine) {
                this.stopIdsThatDisplayVehicleInfo.add(stopover.stop.id)
            }
        })
    }

    hasVehicleInfo(stopover: Stopover): boolean {
        return this.stopIdsWithVehicleInfo.has(stopover.stop.id)
    }

    displayVehicleInfo(stopover: Stopover): boolean {
        return this.stopIdsThatDisplayVehicleInfo.has(stopover.stop.id)
    }

    addDisplayVehicleInfo(stopover: Stopover)
    {
        this.stopIdsThatDisplayVehicleInfo.add(stopover.stop.id)
    }
}