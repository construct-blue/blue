export default class TrainSearchClient {
    constructor(private endpoint: string) {
    }

    public async trip(nr: string)
    {
        const response = await fetch(`${this.endpoint}/db/trip/${nr}`)
        return await response.json()
    }
}