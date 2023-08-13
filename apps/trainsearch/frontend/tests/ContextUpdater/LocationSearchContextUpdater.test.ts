import {describe, expect, it} from "@jest/globals";
import {LocationSearchContext} from "../../src/Context/LocationSearchContext";
import {TestClient} from "../Client/TestClient";
import {trip4711} from "../Models/Trip";
import {locationGrazHbf} from "../Models/Location";
import {LocationSearchContextUpdater} from "../../src/ContextUpdater/LocationSearchContextUpdater";
import {Client} from "../../src/Client/Client";
import fetchMock from "jest-fetch-mock";

describe('LocationSearchContext', () => {
    it('should update locations based on the keyword', async () => {
        const context = new LocationSearchContext('oebb', 'Graz', [])
        const contextUpdater = new LocationSearchContextUpdater(new TestClient({
            departures: [],
            trip: trip4711,
            locationSearch: [locationGrazHbf]
        }));
        const updatedContext = await contextUpdater.update(context)
        expect(updatedContext.locations).toHaveLength(1)
    })
    it('should set locations to empty array when the keyword is empty', async () => {
        const context = new LocationSearchContext('oebb', '', [])
        const client = new TestClient({
            departures: [],
            trip: trip4711,
            locationSearch: [locationGrazHbf]
        });
        const contextUpdater = new LocationSearchContextUpdater(client);
        const updatedContext = await contextUpdater.update(context)
        expect(updatedContext.locations).toHaveLength(0)
    })
    it('should abort previous requests when starting a new update', async () => {
        const context = new LocationSearchContext('oebb', '', [])
        const client = new TestClient({
            departures: [],
            trip: trip4711,
            locationSearch: [locationGrazHbf]
        });
        const contextUpdater = new LocationSearchContextUpdater(client);
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

        const context = new LocationSearchContext('oebb', 'Graz', [locationGrazHbf])
        const contextUpdater = new LocationSearchContextUpdater(client);

        const updatedContext = await contextUpdater.update(context);
        expect(updatedContext.locations).toHaveLength(1)
    })
    it('should allow changing the profile', async () => {
        const context = new LocationSearchContext('oebb', 'Graz', [])
        const contextUpdater = new LocationSearchContextUpdater(new TestClient({
            departures: [],
            trip: trip4711,
            locationSearch: [locationGrazHbf]
        }));
        expect(context.profile).toBe('oebb')
        const updatedContext = await contextUpdater.update(context, 'db')
        expect(updatedContext.profile).toBe('db')
    })
})