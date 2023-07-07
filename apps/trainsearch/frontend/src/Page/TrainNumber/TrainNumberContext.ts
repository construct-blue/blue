import {createContext} from "@lit-labs/context";

export const trainNumberContext = createContext<TrainNumberContext>('trainNumberContext')

export class TrainNumberContext {
    source: string = 'oebb'
    operator?: string = null
    number?: string = null
    trip?: object = null
}
