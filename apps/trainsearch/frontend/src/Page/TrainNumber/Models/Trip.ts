export interface Trip {
    id: string,
    line: {
        name: string
        id: string
    },
    date: string,
    stopovers: Stopover[]
    remarks: Remark[]
}

export interface Stopover {
    stop: {
        id: string,
        name: string
    },
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