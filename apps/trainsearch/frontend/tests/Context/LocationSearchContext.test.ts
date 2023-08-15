import {describe, expect, it} from "@jest/globals";
import {stopGrazHbf} from "../Models/Stop";
import {LocationSearchContext} from "../../src/Context/LocationSearchContext";

describe('LocationSearchContext', () => {
    it('should throw error for empty profile', () => {
        expect(() => new LocationSearchContext('', '', []))
                .toThrow('Missing profile for LocationSearchContext')
    })
    it('should expose the profile, keyword and results for a location search', () => {
        const context = new LocationSearchContext('oebb', 'Graz', [stopGrazHbf])
        expect(context.profile).toBe('oebb')
        expect(context.keyword).toBe('Graz')
        expect(context.stops).toContain(stopGrazHbf)
        expect(context.stops).toHaveLength(1)
    })
})