import {State} from "@lit-app/state/src/state";
import {property} from "@lit-app/state/src/decorators/property";
import {storage} from "@lit-app/state/src/decorators/storage";
import {Location} from "../../Models/Location";

export class DeparturesState extends State {
    @storage({prefix: 'departures', key: 'profile'})
    @property({type: String, value: 'oebb'})
    public profile!: string

    @storage({prefix: 'departures', key: 'keyword'})
    @property({type: String, value: ''})
    public keyword!: string

    @storage({prefix: 'location', key: 'keyword'})
    @property({type: Object, value: null})
    public location!: Location|null
}

export const departuresState = new DeparturesState();