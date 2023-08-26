import {describe, expect, it} from "@jest/globals";
import {create, similar} from "../../src/Favorites/FavoriteTrip";
import {trip4711, trip564} from "../Models/Trip";

describe('FavoriteTrip', () => {
    it('creates a favorite trip from a trip', () => {
        const favoriteTrip = create(trip4711, 'oebb')
        expect(favoriteTrip.profile).toBe('oebb')
        expect(favoriteTrip.line.id).toBe('4711')
    })
    it('should determine if trips are similar enough to be considered the same on another day', () => {
        const a1 = create(trip4711, 'oebb')
        const b1 = create(trip4711, 'oebb')
        expect(similar(a1, b1)).toBe(true)

        const a2 = create(trip4711, 'oebb')
        const b2 = create(trip4711, 'oebb')
        b2.date = new Date()
        expect(similar(a2, b2)).toBe(true)

        const a3 = create(trip4711, 'oebb')
        const b3 = create(trip4711, 'db')
        expect(similar(a3, b3)).toBe(false)

        const a4 = create(trip4711, 'oebb')
        const b4 = create(trip564, 'oebb')
        expect(similar(a4, b4)).toBe(false)
    })
})