export class ImmutableList<T> {
    constructor(private comparator: (a: T, b: T) => boolean, public items: T[] = []) {
    }

    with(item: T): ImmutableList<T> {
        return new ImmutableList<T>(this.comparator, [...this.items, item])
    }

    without(item: T): ImmutableList<T> {
        return new ImmutableList<T>(this.comparator, this.items.filter(current => !this.comparator(item, current)))
    }

    has(item: T): boolean {
        return !!this.items.filter(this.comparator.bind(this, item)).length
    }
}