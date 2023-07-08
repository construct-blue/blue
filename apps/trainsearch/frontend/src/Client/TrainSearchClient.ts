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
}