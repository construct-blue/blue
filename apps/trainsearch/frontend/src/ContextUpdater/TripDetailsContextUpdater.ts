import {ClientInterface} from "../Client/ClientInterface";
import {TripDetailsContext} from "../Context/TripDetailsContext";

export class TripDetailsContextUpdater {
    constructor(private client: ClientInterface) {
    }

    async update(context: TripDetailsContext): Promise<TripDetailsContext> {
        return new TripDetailsContext(
                context.profile,
                await this.client.trip(
                        context.profile,
                        context.id
                )
        )
    }
}