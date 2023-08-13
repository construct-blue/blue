import {css, html, LitElement} from "lit";
import {customElement} from "lit/decorators.js";
import "../../Component/Common/SearchForm"
import {DeparturesController} from "./DeparturesController";
import {SearchFormEvent} from "../../Component/Common/SearchForm";
import {departuresState} from "./DeparturesState";
import {Client} from "../../Client/Client";
import "../../Component/Train/LocationBoard"

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

        button {
            font-size: 1rem;
            background: var(--dark-grey);
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .25rem;
        }

        span {
            display: flex;
            justify-content: space-between;
            gap: .25rem;
        }

        span button {
            padding: .5rem;
        }

        span span {
            justify-content: end;
        }
    `


    protected override render() {
        const result = [
            html`
                <h1><i style="font-family: mav-symbols">ȫ</i> Abfahrten</h1>
                <ts-search-form @suggest="${(event: SearchFormEvent) => this.controller.onSuggest(event)}"
                                @change="${(event: SearchFormEvent) => this.controller.onChange(event)}"
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