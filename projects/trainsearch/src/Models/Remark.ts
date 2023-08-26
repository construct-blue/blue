import {z} from "zod";

export const Remark = z.object({
    type: z.string(),
    code: z.string(),
    prio: z.number().nullable(),
    message: z.string()
})

export type Remark = z.infer<typeof Remark>