import {Location} from "./Location";
import {Line} from "./Trip";

export class Favorites {
    locations: Location[] = []
    lines: { profile: string, uicPrefix: number, direction: string, line: Line }[] = []

    constructor(data) {
        if (data && data.locations) {
            this.locations = data.locations
        }
        if (data && data.lines) {
            this.lines = data.lines
        }
    }

    addLocation(location: Location) {
        this.locations.push(location)
    }

    hasLocation(id: string): boolean {
        return this.locations.filter(location => location.id === id).length > 0
    }

    deleteLocation(id: string) {
        this.locations = this.locations.filter(location => location.id != id)
    }

    addLine(profile: string, uicPrefix: number, direction: string, line: Line) {
        this.lines.push({profile: profile, uicPrefix: uicPrefix, direction: direction, line: line})
    }

    hasLine(line: Line) {
        return this.lines.filter(l => this.compareLine(l.line, line)).length > 0;
    }

    private compareLine(a: Line, b: Line) {
        return a.name == b.name
                && a.id == b.id
                && a.number == b.number
                && a.category == b.category
                && a.product.id == b.product.id
                && a.operator.id == b.operator.id
    }

    deleteLine(line: Line) {
        this.lines = this.lines.filter(l => !this.compareLine(l.line, line))
    }

    static fromStorage(storage: Storage) {
        return new Favorites(JSON.parse(storage.getItem('favorites')))
    }

    save(storage: Storage) {
        storage.setItem('favorites', JSON.stringify(this))
    }

    isEmpty(): boolean {
        return this.locations?.length == 0 && this.lines?.length == 0;
    }
}