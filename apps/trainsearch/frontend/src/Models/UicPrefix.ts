import {z} from "zod";

export const UicPrefix = z.object({
    prefix: z.string(),
    name: z.string()
})

export type UicPrefix = z.infer<typeof UicPrefix>