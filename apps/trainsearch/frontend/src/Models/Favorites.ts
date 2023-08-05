import {Location} from "./Location";

export class Favorites {
    locations: Location[] = []

    constructor(data) {
        if (data && data.locations) {
            this.locations = data.locations
        }
    }

    addLocation(location: Location)
    {
        this.locations.push(location)
    }

    hasLocation(id: string): boolean
    {
        return this.locations.filter(location => location.id === id).length > 0
    }

    deleteLocation(id: string)
    {
        this.locations = this.locations.filter(location => location.id != id)
    }


    static fromStorage(storage: Storage)
    {
        return new Favorites(JSON.parse(storage.getItem('favorites')))
    }

    save(storage: Storage)
    {
        storage.setItem('favorites', JSON.stringify(this))
    }

    isEmpty(): boolean
    {
        return this.locations?.length == 0;
    }
}