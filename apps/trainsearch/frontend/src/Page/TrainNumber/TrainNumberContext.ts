import {createContext} from "@lit-labs/context";

export const trainNumberContext = createContext<TrainNumberContext>('trainNumberContext')

export class TrainNumberContext {
    operator?: string = null
    number?: string = null
    trip?: object = null
}
