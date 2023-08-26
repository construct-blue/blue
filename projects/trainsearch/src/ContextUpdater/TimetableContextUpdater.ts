import {TimetableContext} from "../Context/TimetableContext";
import {ClientInterface} from "../Client/ClientInterface";

export class TimetableContextUpdater {
    constructor(private client: ClientInterface) {
    }

    async update(context: TimetableContext): Promise<TimetableContext> {
        return new TimetableContext(
                context.profile,
                context.stopovers,
                await this.client.stopsWithVehicleInfo(context.profile),
                context.stationId
        )
    }
}