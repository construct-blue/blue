import { z } from "zod";

export const Stop = z.object({
    id: z.string(),
    name: z.string(),
})

export type Stop = z.infer<typeof Stop>;
