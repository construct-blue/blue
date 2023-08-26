import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import '../../Component/Trip/TripDetails'
import {SearchFormEvent, SearchFormSuggestEvent} from "../../Component/Common/SearchForm";
import {TripController} from "./TripController";
import {UicPrefix} from "../../Models/UicPrefix";
import {Client} from "../../Client/Client";
import {Trip} from "../../Models/Trip";
import {tripState} from "./TripState";

@customElement('ts-trip')
export class TripView extends LitElement {

    private controller = new TripController(
        this,
        new Client(document.body.dataset.api ?? ''),
        tripState
    )

    private uicPrefixes: UicPrefix[] = []

    static styles = css`
      :host(ts-number) {
        display: flex;
        flex-direction: column;
      }

      h1 {
        margin: .5rem 0;
      }
    `

    protected async scheduleUpdate() {
        if (!this.uicPrefixes.length) {
            this.uicPrefixes = await this.controller.loadUicPrefixes()
        }
        return super.scheduleUpdate()
    }

    protected render() {
        return html`
            <h1><i style="font-family: oebb-symbols">–</i>Zug</h1>
            <ts-search-form @suggest="${(event: SearchFormSuggestEvent) => this.controller.onSuggest(event)}"
                            @change="${(event: SearchFormEvent<Trip>) => this.controller.onChange(event)}"
                            .suggestions="${this.controller.suggestions}"
                            .value="${this.controller.keyword}"
                            .profile="${this.controller.profile}"
                            .uicPrefix="${this.controller.uicPrefix}"
                            .uicPrefixes="${this.uicPrefixes}"
            ></ts-search-form>
        `;
    }
}
