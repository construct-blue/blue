export interface Trip {
    id: string,
    line: Line,
    date: string,
    stopovers: Stopover[]
    remarks: Remark[]
}

export interface Line {
    name: string
    id: string
}

export interface Stopover {
    stop: {
        id: string,
        name: string
    },
    requestStop?: boolean,
    changedLine?: Line
    departureDelay?: number,
    departurePlatform?: string,
    arrivalDelay?: number,
    departure?: string
    arrival?: string
    reported: boolean
    remarks: Remark[]

}

export interface Remark {
    type: string
    code: string
    prio: number
    message: string
}