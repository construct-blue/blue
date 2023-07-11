import {css, html, LitElement, nothing, PropertyValues, TemplateResult} from "lit";
import {customElement, query, state} from "lit/decorators.js";
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

    @state()
    private autocompleteTrips: Trip[]

    private controller = new TrainNumberController(this)

    private autocompleteAbortController = new AbortController()

    private uicPrefixes: {
        prefix: number
        name: string
    }[] = []

    private onOutsideClick = () => this.blurAutocomplete()

    onclick = e => e.stopPropagation()

    protected async scheduleUpdate(): Promise<unknown> {
        if (!this.uicPrefixes.length) {
            this.uicPrefixes = await this.controller.uicPrefixes(this.context.source);
        }
        return super.scheduleUpdate();
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.onOutsideClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.onOutsideClick)
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

        .input {
            display: flex;
        }

        .autocomplete {
            position: absolute;
            display: flex;
            gap: 1px;
            background: var(--grey);
            flex-direction: column;
            overflow: auto;
            max-height: 50vh;
            border-radius: .25rem;
            top: calc(100% + .25rem);
            box-shadow: rgba(10, 10, 10, 0.5) 0 4px 10px;
        }

        .autocomplete > button {
            border-radius: 0;
        }

        .autocomplete > button:focus,
        .autocomplete > button:hover {
            background: #000000;
        }

        input, select, button {
            padding: .5rem;
            font-size: 1rem;
            border-radius: .25rem;
            border: none;
            background: #2a2a2a;
            color: #f5f5f5;
        }

        input:focus, select:focus {
            outline: 1px solid white;
        }
    `

    protected render(): TemplateResult {
        return html`
            <select class="profile" @change="${this.onChange}">
                <option value="oebb">ÖBB</option>
                <option value="db">DB</option>
            </select>
            <select class="uicPrefix" @change="${this.onChange}">
                ${this.uicPrefixes.map(uic => html`
                    <option value="${uic.prefix}" ?selected="${uic.prefix === this.context.uicPrefix}">${uic.name}
                    </option>`)}
            </select>
            <div class="input">
                <input type="text" @keyup="${this.autocomplete}" @focus="${this.autocomplete}" placeholder="Zugnummer"
                       autocomplete="false"
                       autocapitalize="off">
                ${this.renderAutocomplete()}
            </div>
        `;
    }

    private blurAutocomplete() {
        this.autocompleteAbortController.abort()
        this.autocompleteTrips = null
    }

    private renderAutocomplete() {
        if (!this.autocompleteTrips) {
            return nothing
        }
        return html`
            <div class="autocomplete">
                ${this.autocompleteTrips.map(trip => html`
                    <button @click="${() => this.details(trip.id)}">${trip.line.name}
                        ${datetime(trip.stopovers[0].plannedDeparture, 'time')}<br><small>&rarr;
                            ${trip.stopovers[1].stop.name}</small></button>
                `)}
            </div>
        `
    }

    private async autocomplete() {
        this.autocompleteTrips = null
        this.autocompleteAbortController.abort()
        this.autocompleteAbortController = new AbortController()
        if (this.input.value && this.selectProfile.value) {
            this.autocompleteTrips = await this.controller.tripsearch(
                    this.input.value,
                    Number.parseInt(this.selectUICPrefix.value),
                    this.selectProfile.value,
                    this.autocompleteAbortController
            )
        }
    }

    private details(tripId: string) {
        this.blurAutocomplete()
        this.context.source = this.selectProfile.value
        this.dispatchEvent(new CustomEvent('details', {composed: true, bubbles: true, detail: tripId}))

        localStorage.setItem('trainNumber', this.context.number)
        localStorage.setItem('profile', this.context.source)
        localStorage.setItem('uicPrefix', this.context.uicPrefix.toString())
    }

    private onChange() {
        this.autocomplete()
        this.context.uicPrefix = Number.parseInt(this.selectUICPrefix.value)
        this.context.number = this.input.value
        this.context.source = this.selectProfile.value

        localStorage.setItem('trainNumber', this.context.number)
        localStorage.setItem('profile', this.context.source)
        localStorage.setItem('uicPrefix', this.context.uicPrefix.toString())

        this.context.trip = null
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);

        if (localStorage.getItem('trainNumber')) {
            this.input.value = localStorage.getItem('trainNumber')
        }

        if (localStorage.getItem('profile')) {
            this.selectProfile.value = localStorage.getItem('profile')
        }

        if (localStorage.getItem('uicPrefix')) {
            this.selectUICPrefix.value = localStorage.getItem('uicPrefix')
        }

        this.autocomplete()
    }
}