export default class TrainSearchClient {
    constructor(private endpoint: string) {
    }

    public async tripdetails(id: string, profile: string, controller: AbortController) {
        id = encodeURIComponent(id)
        return await this.fetch(`${this.endpoint}/${profile}/tripdetails/${id}`, controller)
    }

    public async tripsearch(nr: string, uicPrefix: number, profile: string, controller: AbortController) {
        return await this.fetch(`${this.endpoint}/${profile}/tripsearch/${nr}?uicPrefix=${uicPrefix}`, controller)
    }

    public async uicPrefixes(profile: string, controller: AbortController) {
        return await this.fetch(`${this.endpoint}/${profile}/uicprefixes`, controller)
    }

    public async compostion(nr: string, stationId: string, dateTime: string, profile: string, controller: AbortController) {
        const date = new Date(dateTime)
        return await this.fetch(`${this.endpoint}/${profile}/composition/${nr}?station=${stationId}&date=${date.toISOString()}`, controller)
    }

    public async stations(profile: string, controller: AbortController) {
        return await this.fetch(`${this.endpoint}/${profile}/composition/stations`, controller)
    }

    public async location(query: string, profile: string, controller: AbortController) {
        return await this.fetch(`${this.endpoint}/${profile}/location/${query}`, controller)
    }

    public async departures(id: string, profile: string, controller: AbortController) {
        return await this.fetch(`${this.endpoint}/${profile}/departures/${id}`, controller)
    }

    private async fetch(input: RequestInfo|URL, controller: AbortController) {
        try {
            const response = await fetch(input, {signal: controller.signal})
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (err) {
            if (err instanceof DOMException && err.name == 'AbortError') {
                return null;
            }
            throw err;
        }
    }
}