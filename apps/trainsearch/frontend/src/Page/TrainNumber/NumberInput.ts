import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property, query} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "./TrainNumberContext";
import {TrainNumberController} from "./TrainNumberController";

@customElement('ts-number-input')
class NumberInput extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    @query('input')
    private input: HTMLInputElement
    @query('select.uicPrefix')
    private selectUICPrefix: HTMLSelectElement
    @query('select.profile')

    private selectProfile: HTMLSelectElement

    private controller = new TrainNumberController(this)

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

        input {
            flex-grow: 1;
            width: 100%;
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
            <input type="text" placeholder="Zugnummer" autocomplete="false" autocapitalize="off">
            <select class="uicPrefix">
                <option value="">-- UIC Prefix --</option>
                ${this.uicPrefixes.map(uic => html`
                    <option value="${uic.prefix}" ?selected="${uic.prefix === this.context.uicPrefix}">${uic.name}</option>`)}
            </select>
            <button @click="${this.search}">Suchen</button>
        `;
    }

    private search() {
        this.context.uicPrefix = Number.parseInt(this.selectUICPrefix.value)
        this.context.number = this.input.value
        this.context.source = this.selectProfile.value
        this.dispatchEvent(new CustomEvent('search', {composed: true, bubbles: true}))
    }
}