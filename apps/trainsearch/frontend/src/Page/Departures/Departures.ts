import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import "../../Component/Common/SearchForm"
import {DeparturesController} from "./DeparturesController";
import {SearchFormEvent, SearchFormSuggestEvent} from "../../Component/Common/SearchForm";
import {departuresState} from "./DeparturesState";
import {Client} from "../../Client/Client";
import "../../Component/Trip/LocationBoard"
import {Stop} from "../../Models/Stop";

@customElement('ts-departures')
export class Departures extends LitElement {
    private controller = new DeparturesController(
            this,
            new Client(document.body.dataset.api ?? ''),
            departuresState
    )

    static override styles = css`
        :host(ts-departures) {
            display: flex;
            flex-direction: column;
        }

        h1, h2 {
            margin: .5rem 0;
        }
    `


    protected override render() {
        const result = [
            html`
                <h1><i style="font-family: mav-symbols">ȫ</i> Abfahrten</h1>
                <ts-search-form @suggest="${(event: SearchFormSuggestEvent) => this.controller.onSuggest(event)}"
                                @change="${(event: SearchFormEvent<Stop>) => this.controller.onChange(event)}"
                                .suggestions="${this.controller.suggestions}"
                                .value="${this.controller.keyword}"
                                .profile="${this.controller.profile}"
                ></ts-search-form>`
        ];

        if (this.controller.location) {
            result.push(html`
                <ts-location-board .location="${this.controller.location}" .profile="${this.controller.profile}">
                </ts-location-board>`
            )
        }

        return result;
    }
}