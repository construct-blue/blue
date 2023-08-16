import {State} from "@lit-app/state/src/state.js";
import {property} from "@lit-app/state/src/decorators/property.js";
import {storage} from "@lit-app/state/src/decorators/storage.js";
import {Stop} from "../../Models/Stop";

export class DeparturesState extends State {
    @storage({prefix: 'departures', key: 'profile'})
    @property({type: String, value: 'oebb'})
    public profile!: string

    @storage({prefix: 'departures', key: 'keyword'})
    @property({type: String, value: ''})
    public keyword!: string

    @storage({prefix: 'stop', key: 'keyword'})
    @property({type: Object, value: null})
    public stop!: Stop|null
}

export const departuresState = new DeparturesState();