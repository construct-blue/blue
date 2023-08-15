import {describe, expect, it} from "@jest/globals";
import {stopoverBruckMur, stopoverKapfenberg} from "../Models/Stopover";
import {stopBruckMur} from "../Models/Stop";
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
    it('should expose if a stopover should display vehicle information', () => {
        const context = new TimetableContext('oebb', [stopoverBruckMur, stopoverKapfenberg], [stopBruckMur])
        expect(context.hasVehicleInfo(stopoverBruckMur)).toBe(true)
        expect(context.hasVehicleInfo(stopoverKapfenberg)).toBe(false)
    })
})