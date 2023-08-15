import {ClientInterface} from "./ClientInterface";
import {Trip} from "../Models/Trip";
import {Stop} from "../Models/Stop";
import {z} from "zod";

export class Client implements ClientInterface {
    private controllers: AbortController[] = []

    constructor(private basePath: string) {
        if (!basePath) {
            throw 'Missing basePath for Client'
        }
    }

    async departures(profile: string, location: Stop): Promise<Trip[]> {
        if (!profile) {
            throw 'Missing profile for Client.departures'
        }

        if (!location.id) {
            throw 'Missing location for Client.departures'
        }

        const url = this.basePath + '/' + profile + '/departures/' + encodeURIComponent(location.id);
        const response = await this.fetch(url)
        return z.array(Trip).parse(await response.json())
    }

    async trip(profile: string, id: string): Promise<Trip> {
        if (!profile) {
            throw 'Missing profile for Client.trip'
        }

        if (!id) {
            throw 'Missing id for Client.trip'
        }

        const url = this.basePath + '/' + profile + '/tripdetails/' + encodeURIComponent(id);
        const response = await this.fetch(url)

        return Trip.parse(await response.json())
    }

    async locationSearch(profile: string, keyword: string): Promise<Stop[]> {
        if (!profile) {
            throw 'Missing profile for Client.locationSearch'
        }

        if (!keyword) {
            throw 'Missing keyword for Client.locationSearch'
        }

        const url = this.basePath + '/' + profile + '/location/' + encodeURIComponent(keyword);
        const response = await this.fetch(url)

        return z.array(Stop).parse(await response.json())
    }

    async tripSearch(profile: string, uicPrefix: string, query: string): Promise<Trip[]> {
        if (!profile) {
            throw 'Missing profile for Client.tripSearch'
        }

        if (!query) {
            throw 'Missing query for Client.tripSearch'
        }

        if (!uicPrefix) {
            throw 'Missing uicPrefix for Client.tripSearch'
        }

        const url = this.basePath + '/' + profile + '/tripsearch/' + encodeURIComponent(query);
        const response = await this.fetch(url)

        return z.array(Trip).parse(await response.json())
    }


    public async uicPrefixes(profile: string) {
        const url = this.basePath + '/' + profile + '/uicprefixes'
        const response = await this.fetch(url);

        return z.array(z.object({
            id: z.string(),
            name: z.string()
        })).parse(await response.json())
    }

    public async stations(profile: string): Promise<Stop[]> {

        const url = this.basePath + '/' + profile + '/composition/stations'

        const response = await this.fetch(url);

        return z.array(Stop).parse(await response.json())
    }

    private async fetch(input: RequestInfo | URL) {
        const controller = new AbortController();
        const signal = controller.signal
        this.controllers.push(controller)
        try {
            return await fetch(input, {signal: signal})
        } catch (err) {
            if (signal.aborted) {
                throw signal.reason;
            }
            throw err;
        }
    }

    abort(): void {
        while (this.controllers.length) {
            this.controllers.pop()?.abort('Aborted by user!')
        }
    }
}