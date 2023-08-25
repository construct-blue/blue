import {describe, expect, it} from "@jest/globals";
import {trip4711} from "../Models/Trip";
import {TripSearchContext} from "../../src/Context/TripSearchContext";

describe('TripSearchContext', () => {
    it('should throw error for empty profile', () => {
        expect(() => new TripSearchContext('', '', '', []))
                .toThrow('Missing profile for TripSearchContext');
    })
    it('should throw error for empty uicPrefix', () => {
        expect(() => new TripSearchContext('oebb', '', '', []))
                .toThrow('Missing uicPrefix for TripSearchContext');
    })
    it('should expose profile, query and results for a trip search', () => {
        const context = new TripSearchContext('oebb', '81','4711', [trip4711])
        expect(context.profile).toBe('oebb')
        expect(context.query).toBe('4711')
        expect(context.trips).toContain(trip4711)
        expect(context.trips).toHaveLength(1)
    })
})