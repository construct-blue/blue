import {describe, expect, it} from "@jest/globals";
import {
    stopoverBruckMur,
    stopoverGrazHbf,
    stopoverKapfenberg,
    stopoverMuerzzulschlag,
    stopoverSemmering
} from "../Models/Stopover";
import {stopBruckMur, stopGrazHbf, stopKapfenberg, stopMuerzzuschlag, stopSemmering} from "../Models/Stop";
import {TimetableContext} from "../../src/Context/TimetableContext";

describe('TimetableContext', () => {
    it('should throw error for empty profile', () => {
        expect(() => new TimetableContext('', [], [])).toThrow('Missing profile for TimetableContext')
    })
    it('should expose a list of stopovers', () => {
        const context = new TimetableContext('oebb', [stopoverBruckMur, stopoverKapfenberg], [])
        expect(context.stopovers).toContain(stopoverBruckMur)
        expect(context.stopovers).toContain(stopoverKapfenberg)
    })
    it('should display vehicle information where available and not the last stopover', () => {
        const context = new TimetableContext('oebb', [stopoverBruckMur, stopoverKapfenberg, stopoverSemmering], [stopBruckMur, stopSemmering])
        expect(context.hasVehicleInfo(stopoverBruckMur)).toBe(true)
        expect(context.hasVehicleInfo(stopoverKapfenberg)).toBe(false)
        expect(context.hasVehicleInfo(stopoverSemmering)).toBe(false)
    })
    it('should only show vehicle info for the first stop, stops with changed line and a manually added stops', () => {
        const context = new TimetableContext('oebb', [stopoverGrazHbf, stopoverBruckMur, stopoverKapfenberg, stopoverMuerzzulschlag, stopoverSemmering], [stopGrazHbf, stopBruckMur, stopKapfenberg, stopMuerzzuschlag, stopSemmering])
        expect(context.displayVehicleInfo(stopoverGrazHbf)).toBe(true)
        // changed line but last
        expect(context.displayVehicleInfo(stopoverSemmering)).toBe(false)
        // changed line
        expect(context.displayVehicleInfo(stopoverMuerzzulschlag)).toBe(true)
        expect(context.displayVehicleInfo(stopoverBruckMur)).toBe(false)
        expect(context.displayVehicleInfo(stopoverKapfenberg)).toBe(false)
        // manually added
        context.addDisplayVehicleInfo(stopoverKapfenberg)
        expect(context.displayVehicleInfo(stopoverKapfenberg)).toBe(true)
    })
})