export default class TrainSearchClient {
    constructor(private endpoint: string) {
    }

    public async trip(nr: string, operator: string) {
        const response = await fetch(`${this.endpoint}/db/trip/${nr}?operator=${operator}`)
        return await response.json()
    }

    public async operators() {
        const response = await fetch(`${this.endpoint}/db/operators`)
        return await response.json()
    }
}