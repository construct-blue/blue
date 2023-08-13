import {css, html, LitElement, nothing, PropertyValues} from "lit";
import {customElement} from "lit/decorators.js";
import '../../Component/Trip/TripDetails'

@customElement('ts-trip')
export class TripView extends LitElement {

    static styles = css`
        :host(ts-number) {
            display: flex;
            flex-direction: column;
        }

        h1 {
            margin: .5rem 0;
        }

        button {
            display: flex;
            font-size: 1rem;
            text-align: left;
            background: var(--dark-grey);
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: .5rem;
        }
        
        span {
            display: flex;
            justify-content: space-between;
            gap: .25rem;
        }

        span span {
            justify-content: end;
        }
    `

    connectedCallback() {
        super.connectedCallback();

    }

    protected render() {
        return html`
            <h1><i style="font-family: oebb-symbols">–</i>Zug</h1>
        `;
    }
}



