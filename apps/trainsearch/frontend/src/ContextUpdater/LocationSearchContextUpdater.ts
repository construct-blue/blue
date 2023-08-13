import {ClientInterface} from "../Client/ClientInterface";
import {LocationSearchContext} from "../Context/LocationSearchContext";

export class LocationSearchContextUpdater {
    constructor(private client: ClientInterface) {
    }

    async update(context: LocationSearchContext, profile?: string): Promise<LocationSearchContext> {
        this.client.abort()
        profile = profile ?? context.profile
        if (context.keyword) {
            try {
                const locations = await this.client.locationSearch(profile, context.keyword);
                return new LocationSearchContext(
                        profile,
                        context.keyword,
                        locations
                )
            } catch (e) {
                if (e === 'Aborted by user!') {
                    return context;
                }
                throw e;
            }
        } else {
            return new LocationSearchContext(
                    profile,
                    context.keyword,
                    []
            )
        }
    }
}