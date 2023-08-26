import {describe, expect, it} from "@jest/globals";
import {trip4711} from "../Models/Trip";
import {TripDetailsContext} from "../../src/Context/TripDetailsContext";

describe('TripDetailsContext', () => {
    it('should throw error for empty profile or invalid trip', () => {
        expect(() => new TripDetailsContext('', trip4711)).toThrow('Missing profile for TripDetailsContext')
        const trip = Object.assign({}, trip4711);
        trip.id = '';
        expect(() => new TripDetailsContext('oebb', trip)).toThrow('Invalid trip for TripDetailsContext')
    })
    it('should expose the profile and id of the trip', () => {
        const context = new TripDetailsContext('oebb', trip4711)
        expect(context.profile).toBe('oebb')
        expect(context.id).toBe(trip4711.id)
    })
})