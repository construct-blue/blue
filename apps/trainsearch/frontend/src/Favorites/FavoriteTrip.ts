import {Trip} from "../Models/Trip";
import {z} from "zod";

export const FavoriteTrip = Trip.extend({
    profile: z.string()
})

export type FavoriteTrip = z.infer<typeof FavoriteTrip>
