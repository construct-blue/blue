export interface Trip {
    id: string,
    line: Line,
    date: string,
    direction: string,
    stopovers: Stopover[]
    foreign?: boolean
    remarks: Remark[]
}

export interface Line {
    name: string
    trainName?: string
    id: string
}

export interface Stopover {
    stop: {
        id: string,
        name: string
    },
    requestStop?: boolean,
    changedLine?: boolean
    line?: Line,
    departureDelay?: number,
    departurePlatform?: string,
    arrivalDelay?: number,
    departure?: string
    plannedDeparture?: string
    arrival?: string
    plannedArrival?: string
    reported: boolean
    remarks: Remark[]

}

export interface Remark {
    type: string
    code: string
    prio: number
    message: string
}