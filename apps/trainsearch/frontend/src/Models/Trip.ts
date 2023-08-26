import {z} from "zod";
import {Line} from "./Line";
import {Remark} from "./Remark";
import {Information} from "./Information";
import {Stopover} from "./Stopover";

export const Trip = z.object({
    id: z.string(),
    date: z.date({coerce: true}),
    direction: z.string().nullable(),
    foreign: z.boolean().nullable(),
    line: Line,
    stopovers: z.array(Stopover),
    remarks: z.array(Remark),
    infos: z.array(Information)
})

export type Trip = z.infer<typeof Trip>
