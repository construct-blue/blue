import { z } from "zod";

export const Location = z.object({
    id: z.string(),
    name: z.string(),
})

export type Location = z.infer<typeof Location>;
