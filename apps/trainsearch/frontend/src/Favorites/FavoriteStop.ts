import {Stop} from "../Models/Stop";
import {z} from "zod";

export const FavoriteStop = Stop.extend({
    profile: z.string()
})

export type FavoriteStop = z.infer<typeof FavoriteStop>

export const equals = (a: FavoriteStop, b: FavoriteStop) =>
        a.profile === b.profile && a.id === b.id

export const create = (stop: Stop, profile: string): FavoriteStop => {
    return {...stop, profile: profile}
}