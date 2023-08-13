import {describe, expect, it} from "@jest/globals";
import {LocationBoardContext} from "../../src/Context/LocationBoardContext";
import {Location} from "../../src/Models/Location";
import {TestClient} from "../Client/TestClient";
import {LocationBoardContextUpdater} from "../../src/ContextUpdater/LocationBoardContextUpdater";
import {locationGrazHbf} from "../Models/Location";

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
})