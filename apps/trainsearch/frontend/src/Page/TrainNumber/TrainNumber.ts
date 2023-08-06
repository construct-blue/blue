import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement, state} from "lit/decorators.js";
import {TrainSearchController} from "../../Client/TrainSearchController";
import '../../Component/Train/TrainDetails'
import {TrainNumberContext, trainNumberContext} from "./TrainNumberContext";
import {ObjectContextProvider} from "libs/lit-helper/src/Mixin/ObjectContext";
import {SearchFormEvent} from "../../Component/Common/SearchForm";
import {Trip} from "../../Models/Trip";
import {lineName} from "../../Directive/LineName";
import {datetime} from "../../Directive/DateTime";

import {State, property, query, storage} from "@lit-app/state";
import {StateController} from "@lit-app/state/src/state-controller.js";

class TrainNumberState extends State {
    @query({parameter: 'value'})
    @storage({key: 'value', prefix: 'train'})
    @property({value: ''})
    value: string

    @query({parameter: 'profile'})
    @storage({key: 'profile', prefix: 'train'})
    @property({value: 'oebb'})
    profile: string

    @query({parameter: 'uicPrefix'})
    @storage({key: 'uicPrefix', prefix: 'train'})
    @property({value: '81'})
    uicPrefix: string
}

const tnState = new TrainNumberState();

@customElement('ts-number')
export class TrainNumber extends ObjectContextProvider(LitElement)(trainNumberContext, new TrainNumberContext()) {
    private stateController = new StateController(this, tnState)
    private controller = new TrainSearchController(this)

    @state()
    private trip: Trip
    @state()
    private suggestions


    static styles = css`
        :host(ts-number) {
            display: flex;
            flex-direction: column;
        }

        h1 {
            margin: .5rem 0;
        }
    `

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('details', async (e: CustomEvent) => {
            e.stopPropagation()
            this.trip = null
            this.trip = await this.controller.tripdetails(e.detail, tnState.profile)
        })
    }

    protected render() {
        return html`
            <h1><i style="font-family: oebb-symbols">–</i>Zug</h1>
            <ts-search-form .suggestions="${this.suggestions}" @suggest="${this.onSuggest}"
                            @change="${this.onChange}" uic-select
                            .value="${tnState.value}"
                            .uicPrefix="${tnState.uicPrefix}"
                            .profile="${tnState.profile}"
            ></ts-search-form>
            ${this.trip ? html`
                <ts-details .trip="${this.trip}" profile="${tnState.profile}"></ts-details>` : nothing}
        `;
    }


    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if (tnState.value) {
            this.refreshSuggestions()
        }
    }

    private async onSuggest(event: SearchFormEvent) {
        tnState.profile = event.profile
        tnState.uicPrefix = event.uicPrefix
        tnState.value = event.value
        await this.refreshSuggestions()
    }

    private async refreshSuggestions() {
        this.suggestions = null
        if (!tnState.value) {
            this.trip = null
            return;
        }

        this.controller.abort()
        const trips: Trip[] = (await this.controller.tripsearch(tnState.value, Number.parseInt(tnState.uicPrefix), tnState.profile))
        if (trips) {
            this.suggestions = trips.map(trip => {
                return {
                    id: trip.id, name:
                            html`${lineName(trip.line)}&nbsp;${datetime(trip.stopovers[0].plannedDeparture, 'time')}
                        <br>&rarr;&nbsp;${trip.stopovers[1].stop.name}`
                }
            })
        }
    }

    private async onChange(event: SearchFormEvent) {
        this.controller.abort()
        this.trip = null;
        this.trip = await this.controller.tripdetails(event.id, event.profile)
        tnState.profile = event.profile
    }
}



