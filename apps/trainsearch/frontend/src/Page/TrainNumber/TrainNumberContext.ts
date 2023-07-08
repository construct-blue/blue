import {createContext} from "@lit-labs/context";
import {Trip} from "./Models/Trip";

export const trainNumberContext = createContext<TrainNumberContext>('trainNumberContext')

export class TrainNumberContext {
    source: string = 'oebb'
    operator?: string = 'oebb'
    number?: string = null
    trip?: Trip = null
}
