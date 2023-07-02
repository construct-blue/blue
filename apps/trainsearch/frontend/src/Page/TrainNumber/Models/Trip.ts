export interface Trip {
    line: {
        name: string
    }
    stopovers: Stopover[]
    remarks: {
        type: string
        code: string
        prio: number
        message: string
    }[]
}

export interface Stopover {
    stop: {
        id: string,
        name: string
    },
    delay?: number,
    departure?: string
    arrival?: string
    reported: boolean
}