import {describe, expect, it} from "@jest/globals";
import {LocationBoardContext} from "../../src/Context/LocationBoardContext";
import {Trip} from "../../src/Models/Trip";
import {trip4711} from "../Models/Trip";
import {stopGrazHbf} from "../Models/Stop";

describe('LocationBoardContext', () => {
    it('should expose the id and name and profile of the location', () => {
        const context = new LocationBoardContext('oebb', stopGrazHbf, []);
        expect(context.name).toBe('Graz Hbf')
        expect(context.id).toBe('8100173')
        expect(context.profile).toBe('oebb')
    })
    it('should expose a list of trips departing from the location', () => {
        const departures: Trip[] = [trip4711];
        const context = new LocationBoardContext('oebb', stopGrazHbf, departures);
        expect(context.departures[0].id).toBe('123')
    })
    it('should allow to set a trip as the selected trip', () => {
        const departures: Trip[] = [trip4711];
        const context = new LocationBoardContext('oebb', stopGrazHbf, departures);
        expect(context.selectedTrip).toBeNull()
        context.selectTrip(context.departures[0])
        expect(context.selectedTrip).toBe(context.departures[0])
        context.selectTrip(null)
        expect(context.selectedTrip).toBeNull()
    })
    it('should throw error for empty profile', () => {
        expect(() => new LocationBoardContext('', {name: 'Test', id: '123'}, []))
                .toThrow('Missing profile for LocationBoardContext')
    })
    it('should throw error for locations missing name or id', () => {
        expect(() => new LocationBoardContext('oebb', {name: '', id: ''}, []))
                .toThrow('Missing stop for LocationBoardContext')
    })
})