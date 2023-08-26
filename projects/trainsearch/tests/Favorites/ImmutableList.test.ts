import {describe, expect, it} from "@jest/globals";
import {ImmutableList} from "../../src/Favorites/ImmutableList";
import {create, FavoriteTrip, similar} from "../../src/Favorites/FavoriteTrip";
import {trip4711} from "../Models/Trip";

describe('ImmutableList', () => {
    it('should compare added items with comparator', () => {
        const trip = create(trip4711, 'oebb')
        const list = new ImmutableList<FavoriteTrip>(similar)
        const newList = list.with(trip)
        expect(list.has(trip)).toBe(false)
        expect(newList.has(trip)).toBe(true)
        expect(list).not.toBe(newList)
    })
})