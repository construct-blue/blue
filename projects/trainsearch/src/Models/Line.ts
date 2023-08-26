import { z } from "zod";

export const Line = z.object({
    id: z.string(),
    name: z.string(),
    number: z.string(),
    category: z.string(),
    admin: z.string(),
    trainName: z.string().nullable(),
    operator: z.object({
        id: z.string()
    }),
    product: z.object({
        id: z.string()
    }),
});

export type Line = z.infer<typeof Line>