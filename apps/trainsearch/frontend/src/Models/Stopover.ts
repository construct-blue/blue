import { z } from "zod";
import {Line} from "./Line";
import {Remark} from "./Remark";
import {Information} from "./Information";

export const Stopover = z.object({
    stop: z.object({
        id: z.string(),
        name: z.string()
    }),
    requestStop: z.boolean().nullable(),
    changedLine: z.boolean().nullable(),
    line: Line.nullable(),
    departureDelay: z.number().nullable(),
    departurePlatform: z.string().nullable(),
    arrivalDelay: z.number().nullable(),
    departure: z.string().nullable(),
    plannedDeparture: z.string().nullable(),
    arrival: z.string().nullable(),
    plannedArrival: z.string().nullable(),
    reported: z.boolean(),
    remarks: z.array(Remark),
    infos: z.array(Information)
})


export type Stopover = z.infer<typeof Stopover>