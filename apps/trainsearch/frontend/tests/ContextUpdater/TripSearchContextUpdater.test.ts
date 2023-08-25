import {describe, expect, it} from "@jest/globals";
import {TripSearchContext} from "../../src/Context/TripSearchContext";
import {TestClient} from "../Client/TestClient";
import {trip4711} from "../Models/Trip";
import {Client} from "../../src/Client/Client";
import {TripSearchContextUpdater} from "../../src/ContextUpdater/TripSearchContextUpdater";
import fetchMock from "jest-fetch-mock";

describe('TripSearchContextUpdater', () => {
    it('should update trips based on query', async () => {
        const context = new TripSearchContext('oebb', '81', '4711', []);
        const contextUpdater = new TripSearchContextUpdater(new TestClient({
            departures: [],
            trip: trip4711,
            stops: [],
        }));
        const updatedContext = await contextUpdater.update(context)
        expect(updatedContext.trips).toContain(trip4711)
    })
    it('should set locations to empty array when the query is empty', async () => {
        const context = new TripSearchContext('oebb', '81', '', [trip4711])
        const contextUpdater = new TripSearchContextUpdater(new TestClient({
            departures: [],
            trip: trip4711,
            stops: []
        }))
        const updatedContext = await contextUpdater.update(context)
        expect(updatedContext.trips).toHaveLength(0)
    })
    it('should abort previous requests when starting a new update', async () => {
        const context = new TripSearchContext('oebb', '81', '', [])
        const client = new TestClient({
            departures: [],
            trip: trip4711,
            stops: []
        });
        const contextUpdater = new TripSearchContextUpdater(client);
        await contextUpdater.update(context)
        expect(client.aborted).toBe(true)
    })
    it('should catch abort errors and return context with previous data', async () => {
        const awaitTimeout = async () => new Promise(r => setTimeout(r, 100))

        const client = new Client('https://trainsearch-api.local/test')

        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/location/Graz',
                async () => {
                    await awaitTimeout()
                    return Promise.resolve({
                        body: JSON.stringify([])
                    })
                }
        )

        setTimeout(() => client.abort(), 50)

        const context = new TripSearchContext('oebb', '81', 'Graz', [trip4711])
        const contextUpdater = new TripSearchContextUpdater(client);

        const updatedContext = await contextUpdater.update(context);
        expect(updatedContext.trips).toHaveLength(1)
    })
    it('should allow changing the profile', async () => {
        const context = new TripSearchContext('oebb', '81', 'Graz', [])
        const contextUpdater = new TripSearchContextUpdater(new TestClient({
            departures: [],
            trip: trip4711,
            stops: []
         }));
        expect(context.profile).toBe('oebb')
        const updatedContext = await contextUpdater.update(context, 'db')
        expect(updatedContext.profile).toBe('db')
    })
})