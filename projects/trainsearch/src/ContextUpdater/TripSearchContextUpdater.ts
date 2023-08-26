import {TripSearchContext} from "../Context/TripSearchContext";
import {ClientInterface} from "../Client/ClientInterface";

export class TripSearchContextUpdater {
    constructor(private client: ClientInterface) {
    }

    async update(context: TripSearchContext, profile?: string, uicPrefix?: string): Promise<TripSearchContext> {
        this.client.abort()
        profile = profile ?? context.profile
        uicPrefix = uicPrefix ?? context.uicPrefix
        if (context.query) {
            try {
                const locations = await this.client.tripSearch(profile, uicPrefix, context.query);
                return new TripSearchContext(
                        profile,
                        uicPrefix,
                        context.query,
                        locations
                )
            } catch (e) {
                if (e === 'Aborted by user!') {
                    return context;
                }
                throw e;
            }
        } else {
            return new TripSearchContext(
                    profile,
                    uicPrefix,
                    context.query,
                    []
            )
        }
    }
}