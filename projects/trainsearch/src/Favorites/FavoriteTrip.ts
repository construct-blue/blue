import {Trip} from "../Models/Trip";
import {z} from "zod";

export const FavoriteTrip = Trip.extend({
    profile: z.string()
})

export type FavoriteTrip = z.infer<typeof FavoriteTrip>

export const similar = (a: FavoriteTrip, b: FavoriteTrip) =>
        a.profile === b.profile
        && a.line.operator.id === b.line.operator.id
        && a.line.product.id === b.line.product.id
        && a.line.category === b.line.category
        && a.line.id === b.line.id
        && a.line.number === b.line.number
        && a.line.admin === b.line.admin

export const create = (trip: Trip, profile: string): FavoriteTrip => {
    return {...trip, profile: profile}
}