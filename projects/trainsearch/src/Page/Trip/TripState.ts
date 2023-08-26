import {State} from "@lit-app/state/src/state.js";
import {property} from "@lit-app/state/src/decorators/property.js";
import {storage} from "@lit-app/state/src/decorators/storage.js";
import {Trip} from "../../Models/Trip";

export class TripState extends State {
    @storage({prefix: 'trip', key: 'profile'})
    @property({type: String, value: 'oebb'})
    public profile!: string

    @storage({prefix: 'trip', key: 'uicPrefix'})
    @property({type: Number, value: 81})
    public uicPrefix!: number

    @storage({prefix: 'trip', key: 'query'})
    @property({type: String, value: ''})
    public query!: string

    @storage({prefix: 'trip', key: 'trip'})
    @property({type: Object, value: null})
    public trip!: Trip|null
}

export const tripState = new TripState();