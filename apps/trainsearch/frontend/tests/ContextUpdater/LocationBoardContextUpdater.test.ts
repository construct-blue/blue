import {describe, expect, it} from "@jest/globals";
import {LocationBoardContext} from "../../src/Context/LocationBoardContext";
import {Location} from "../../src/Models/Location";
import {TestClient} from "../Client/TestClient";
import {LocationBoardContextUpdater} from "../../src/ContextUpdater/LocationBoardContextUpdater";
import {locationGrazHbf} from "../Models/Location";
import {trip4711} from "../Models/Trip";
import {Client} from "../../src/Client/Client";
import fetchMock from "jest-fetch-mock";

describe('LocationBoardContextUpdater', () => {
    it('should update the departures of a location context', async () => {
        const location: Location = {
            name: 'Graz Hbf',
            id: '8100173'
        };
        const context = new LocationBoardContext('oebb', location, []);

        const trip = {
            id: '123',
            line: {
                id: '4711',
                name: 'S 3',
                number: '3',
                category: 'S',
                admin: '81',
                trainName: null,
                operator: {id: 'oebb'},
                product: {id: 'suburban'},
            },
            direction: 'Graz Hbf',
            date: new Date(),
            stopovers: [],
            infos: [],
            remarks: [],
            foreign: false,
        };
        const updater = new LocationBoardContextUpdater(new TestClient({
            departures: [
                trip
            ],
            trip: trip,
            locationSearch: [locationGrazHbf]
        }));
        const updatedContext = await updater.update(context);
        expect(updatedContext.departures).toHaveLength(1);
    })
    it('should update the selectedTrip of a location context', async () => {
        const location: Location = {
            name: 'Graz Hbf',
            id: '8100173'
        };
        const context = new LocationBoardContext('oebb', location, []);

        context.selectTrip({
            id: '123',
            line: {
                id: '4711',
                name: 'S 3',
                number: '3',
                category: 'S',
                admin: '81',
                trainName: null,
                operator: {id: 'oebb'},
                product: {id: 'suburban'},
            },
            direction: '',
            date: new Date(),
            stopovers: [],
            infos: [],
            remarks: [],
            foreign: false,
        })

        const updater = new LocationBoardContextUpdater(new TestClient({
            departures: [],
            trip: {
                id: '123',
                line: {
                    id: '4711',
                    name: 'S 3',
                    number: '3',
                    category: 'S',
                    admin: '81',
                    trainName: null,
                    operator: {id: 'oebb'},
                    product: {id: 'suburban'},
                },
                direction: 'Graz Hbf',
                date: new Date('11-08-2023'),
                stopovers: [],
                infos: [],
                remarks: [],
                foreign: false,
            },
            locationSearch: [locationGrazHbf]
        }));

        const updatedContext = await updater.update(context)
        expect(context.selectedTrip?.direction).toBe('')
        expect(updatedContext.selectedTrip?.direction).toBe('Graz Hbf')
    })
    it('should abort previous requests when starting a new update', async () => {
        const context = new LocationBoardContext('oebb', locationGrazHbf, [])
        const client = new TestClient({
            departures: [trip4711],
            trip: trip4711,
            locationSearch: [locationGrazHbf]
        });
        const contextUpdater = new LocationBoardContextUpdater(client);
        await contextUpdater.update(context)
        expect(client.aborted).toBe(true)
    })
    it('should catch abort errors and return context with previous data', async () => {
        const awaitTimeout = async () => new Promise(r => setTimeout(r, 100))

        const client = new Client('https://trainsearch-api.local/test')

        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/departures/8100173',
                async () => {
                    await awaitTimeout()
                    return Promise.resolve({
                        body: JSON.stringify([])
                    })
                }
        )

        setTimeout(() => client.abort(), 50)

        const context = new LocationBoardContext('oebb', locationGrazHbf, [trip4711])
        const contextUpdater = new LocationBoardContextUpdater(client);

        const updatedContext = await contextUpdater.update(context);
        expect(updatedContext.departures).toHaveLength(1)
    })
})