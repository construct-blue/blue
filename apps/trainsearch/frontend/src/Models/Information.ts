import {z} from "zod";

export const Information = z.object({
    id: z.string(),
    head: z.string(),
    text: z.string()
})

export type Information = z.infer<typeof Information>