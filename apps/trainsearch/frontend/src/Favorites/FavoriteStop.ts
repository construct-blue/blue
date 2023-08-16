import {Stop} from "../Models/Stop";
import {z} from "zod";

export const FavoriteStop = Stop.extend({
    profile: z.string()
})

export type FavoriteStop = z.infer<typeof FavoriteStop>