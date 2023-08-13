import {describe, expect, it} from "@jest/globals";
import {TripDetailsContext} from "../../src/Context/TripDetailsContext";
import {trip4711} from "../Models/Trip";
import {TestClient} from "../Client/TestClient";
import {TripDetailsContextUpdater} from "../../src/ContextUpdater/TripDetailsContextUpdater";

describe('TripDetailsContextUpdater', () => {
    it('should update the trip of a trip context', async () => {
        const context = new TripDetailsContext('oebb', trip4711)
        const contextUpdater = new TripDetailsContextUpdater(new TestClient(
                {
                    departures: [],
                    locationSearch: [],
                    trip: Object.assign({}, trip4711, {direction: 'Graz Ostbahnhof'})
                }
        ));

        const updatedContext = await contextUpdater.update(context)
        expect(updatedContext.trip.direction).toBe('Graz Ostbahnhof')
    })
})