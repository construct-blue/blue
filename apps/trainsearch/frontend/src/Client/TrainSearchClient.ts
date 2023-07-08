export default class TrainSearchClient {
    constructor(private endpoint: string) {
    }

    public async trip(nr: string, operator: string, source: string) {
        const response = await fetch(`${this.endpoint}/${source}/trip/${nr}?operator=${operator}`)
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }

    public async operators(source: string) {
        const response = await fetch(`${this.endpoint}/${source}/operators`)
        if (!response.ok) {
            return null;
        }
        return await response.json()
    }

    public async compostion(nr: string, stationId: string, source: string) {
        const response = await fetch(`${this.endpoint}/${source}/composition/${nr}?station=${stationId}`)
        if (!response.ok) {
            return null;
        }
        return await response.json();
    }
}