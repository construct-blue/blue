export interface Trip {
    id: string,
    line: Line,
    date: string,
    direction: string,
    stopovers: Stopover[]
    foreign?: boolean
    remarks: Remark[]
    infos: Information[]
}

export interface Line {
    name: string
    category: string
    operator: {
        id: string
    },
    product: {
        id: string
    }
    number: string
    trainName?: string
    id: string
    admin: string
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
    infos: Information[]
}

export interface Remark {
    type: string
    code: string
    prio: number
    message: string
}

export interface Information {
    id: string,
    head: string,
    text: string
}