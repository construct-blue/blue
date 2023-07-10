export default class TrainSearchClient {
    constructor(private endpoint: string) {
    }

    public async trip(nr: string, uicPrefix: number, profile: string) {
        const response = await fetch(`${this.endpoint}/${profile}/trip/${nr}?uicPrefix=${uicPrefix}`)
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }

    public async tripdetails(id: string, profile: string) {
        id = encodeURIComponent(id)
        const response = await fetch(`${this.endpoint}/${profile}/tripdetails/${id}`)
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }

    public async tripsearch(nr: string, uicPrefix: number, profile: string, controller: AbortController) {

        const response = await fetch(`${this.endpoint}/${profile}/tripsearch/${nr}?uicPrefix=${uicPrefix}`, {signal: controller.signal})
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }
    public async operators(profile: string) {
        const response = await fetch(`${this.endpoint}/${profile}/operators`)
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }

    public async uicPrefixes(profile: string) {
        const response = await fetch(`${this.endpoint}/${profile}/uicprefixes`)
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }
    public async compostion(nr: string, stationId: string, profile: string) {
        const response = await fetch(`${this.endpoint}/${profile}/composition/${nr}?station=${stationId}`)
        if (!response.ok) {
            return null;
        }
        return await response.json();
    }

    public async stations(profile: string)
    {
        const response = await fetch(`${this.endpoint}/${profile}/composition/stations`)
        if (!response.ok) {
            return null;
        }
        return await response.json();
    }
}