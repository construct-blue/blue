import {z} from "zod";

export const UicPrefix = z.object({
    prefix: z.coerce.number(),
    name: z.string()
})

export type UicPrefix = z.infer<typeof UicPrefix>