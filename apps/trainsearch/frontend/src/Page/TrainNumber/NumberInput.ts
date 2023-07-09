import {css, html, LitElement, nothing, PropertyValues, TemplateResult} from "lit";
import {customElement, property, query, state} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "./TrainNumberContext";
import {TrainNumberController} from "./TrainNumberController";
import {Trip} from "./Models/Trip";
import {datetime} from "../../Directive/DateTime";

@customElement('ts-number-input')
class NumberInput extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    @query('input')
    private input: HTMLInputElement
    @query('select.uicPrefix')
    private selectUICPrefix: HTMLSelectElement
    @query('select.profile')

    private selectProfile: HTMLSelectElement

    private controller = new TrainNumberController(this)

    private autocompleteAbortController = new AbortController()

    @state()
    private autcompleteTrips: Trip[]

    private uicPrefixes: {
        prefix: number
        name: string
    }[] = []

    protected async scheduleUpdate(): Promise<unknown> {
        this.uicPrefixes = await this.controller.uicPrefixes(this.context.source);
        return super.scheduleUpdate();
    }

    static styles = css`
        :host(ts-number-input) {
            display: flex;
            gap: 1px;
        }
        
        .input, input {
            flex-grow: 1;
            width: 100%;
            position: relative;
        }
        
        .autocomplete {
            position: absolute;
            display: flex;
            flex-direction: column;
            overflow: auto;
            max-height: 50vh;
        }

        input, select, button {
            padding: .5rem;
            font-size: 1rem;
            border-radius: 0;
            border: none;
        }

        input:focus, select:focus {
            outline: 1px solid white;
        }
    `

    protected render(): TemplateResult {
        return html`
            <select class="profile" @change="${this.search}">
                <option value="oebb">ÖBB</option>
                <option value="db">DB</option>
            </select>
            <select class="uicPrefix">
                ${this.uicPrefixes.map(uic => html`
                    <option value="${uic.prefix}" ?selected="${uic.prefix === this.context.uicPrefix}">${uic.name}
                    </option>`)}
            </select>
            <div class="input">
                <input type="text" @keyup="${this.autocomplete}" @focus="${this.autocomplete}" placeholder="Zugnummer" autocomplete="false"
                       autocapitalize="off">
                ${this.renderAutocomplete()}
            </div>
            <button @click="${this.search}">Suchen</button>
        `;
    }

    private blurAutocomplete()
    {
        this.autocompleteAbortController.abort()
        this.autcompleteTrips = null
    }

    private renderAutocomplete() {
        if (!this.autcompleteTrips) {
            return nothing
        }
        return html`
            <div class="autocomplete">
                ${this.autcompleteTrips.map(trip => html`
                    <button @click="${() => this.details(trip.id)}">${trip.line.name} ${datetime(trip.stopovers[0].plannedDeparture, 'time')}<br><small>&rarr; ${trip.stopovers[1].stop.name}</small></button>
                `)}
            </div>
        `
    }

    private async autocomplete() {
        this.autcompleteTrips = null
        this.autocompleteAbortController.abort()
        this.autocompleteAbortController = new AbortController()
        if (this.input.value && this.selectProfile.value) {
            this.autcompleteTrips = await this.controller.tripsearch(
                    this.input.value,
                    Number.parseInt(this.selectUICPrefix.value),
                    this.selectProfile.value,
                    this.autocompleteAbortController
            )
        }
    }

    private details(tripId: string)
    {
        this.blurAutocomplete()
        this.context.source = this.selectProfile.value
        this.dispatchEvent(new CustomEvent('details', {composed: true, bubbles: true, detail: tripId}))
    }

    private search() {
        this.blurAutocomplete()
        this.context.uicPrefix = Number.parseInt(this.selectUICPrefix.value)
        this.context.number = this.input.value
        this.context.source = this.selectProfile.value
        this.dispatchEvent(new CustomEvent('search', {composed: true, bubbles: true}))
    }
}