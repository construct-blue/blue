import {describe, expect, it, jest} from "@jest/globals";
import {Client} from "../../src/Client/Client";
import fetchMock from "jest-fetch-mock";
import {trip4711} from "../Models/Trip";
import {stopGrazHbf} from "../Models/Stop";

describe('Client', () => {
    it('should throw error when basePath is empty', () => {
        expect(() => new Client(''))
                .toThrow('Missing basePath for Client')
    })
    it('should throw error when required method args are empty', async () => {
        const client = new Client('https://trainsearch-api.local/test')

        await expect(() => client.departures('', {id: '', name: ''}))
                .rejects.toBe('Missing profile for Client.departures')
        await expect(() => client.trip('', ''))
                .rejects.toBe('Missing profile for Client.trip')
        await expect(() => client.locationSearch('', ''))
                .rejects.toBe('Missing profile for Client.locationSearch')
        await expect(() => client.departures('oebb', {name: '', id: ''}))
                .rejects.toBe('Missing location for Client.departures')
        await expect(() => client.trip('oebb', ''))
                .rejects.toBe('Missing id for Client.trip')
        await expect(() => client.locationSearch('oebb', ''))
                .rejects.toBe('Missing keyword for Client.locationSearch')
        await expect(() => client.tripSearch('', '81', '4711'))
                .rejects.toBe('Missing profile for Client.tripSearch')
        await expect(() => client.tripSearch('oebb', '', '4711'))
                .rejects.toBe('Missing uicPrefix for Client.tripSearch')
        await expect(() => client.tripSearch('oebb', '81', ''))
                .rejects.toBe('Missing query for Client.tripSearch')
    })

    it('should fetch departures and return them as array of trips', async () => {
        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/departures/8100173',
                () => new Promise(r => r({body: JSON.stringify([trip4711])}))
        )

        const client = new Client('https://trainsearch-api.local/test')
        const fetchedDepartures = await client.departures('oebb', stopGrazHbf)
        expect(fetchedDepartures).toHaveLength(1)
        expect(fetchedDepartures[0].id).toBe('123')
    })
    it('should fetch a trip by uri encoded id', async () => {
        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/tripdetails/123%23A%7C321',
                () => new Promise(r => r({body: JSON.stringify(trip4711)}))
        )

        const client = new Client('https://trainsearch-api.local/test')
        const fetchedTrip = await client.trip('oebb', '123#A|321')
        expect(fetchedTrip.id).toBe('123')
        expect(fetchedTrip.direction).toBe('Graz Hbf')
    })
    it('should fetch locations matching a uri encoded keyword', async () => {
        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/location/Graz%20H',
                () => new Promise(r => r({body: JSON.stringify([stopGrazHbf])}))
        )

        const client = new Client('https://trainsearch-api.local/test')
        const fetchedLocations = await client.locationSearch('oebb', 'Graz H')
        expect(fetchedLocations[0].name).toBe(stopGrazHbf.name)
        expect(fetchedLocations[0].id).toBe(stopGrazHbf.id)
        expect(fetchedLocations).toHaveLength(1)
    })

    it('should fetch trips matching a query', async () => {
        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/tripsearch/S%204711?uicPrefix=81',
                () => new Promise(r => r({body: JSON.stringify([trip4711])}))
        )

        const client = new Client('https://trainsearch-api.local/test')
        const fetchedTrips = await client.tripSearch('oebb', '81', 'S 4711')
        expect(fetchedTrips[0].id).toBe(trip4711.id)
        expect(fetchedTrips).toHaveLength(1)
    })
    it('should allow to abort pending requests', async () => {
        const awaitTimeout = async () => new Promise(r => setTimeout(r, 100))

        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/tripsearch/4711',
                async () => Promise.resolve({body: JSON.stringify([trip4711])})
        )

        const client = new Client('https://trainsearch-api.local/test')
        await client.tripSearch('oebb', '81', '4711')

        fetchMock.mockOnceIf(
                'https://trainsearch-api.local/test/oebb/tripsearch/4711',
                async () => {
                    await awaitTimeout()
                    return Promise.resolve({
                        body: JSON.stringify([trip4711])
                    })
                }
        )

        setTimeout(() => client.abort(), 50)
        await expect(client.tripSearch('oebb', '81', '4711'))
                .rejects.toBe('Aborted by user!')
    })
})