import {z} from "zod";

export const Composition = z.object({
    vehicles: z.array(z.object({
        uicNumber: z.string(),
        type: z.string(),
        ranking: z.number(),
        locked: z.boolean(),
        load: z.number()
    }))
})

export type Composition = z.infer<typeof Composition>