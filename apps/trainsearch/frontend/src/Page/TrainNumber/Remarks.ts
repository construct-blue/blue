import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Trip} from "./Models/Trip";

@customElement('ts-remarks')
class Remarks extends LitElement {
    @property()
    public trip: Trip

    static styles = css`
      :host(ts-remarks) {
        display: flex;
        flex-direction: column;
      }

      p {
        margin: 0;
        padding: .25rem 1rem;
        border-bottom: 1px solid black;
        background: var(--grey);
        color: black;
      }

      p.M {
        background: var(--orange);
        color: black;
      }

      p:last-of-type {
        border: none;
      }
    `

    protected render(): TemplateResult {
        return html`
            ${this.trip.remarks.map(remark => html`<p class="${remark.type}">${remark.message}</p>`)}
        `;
    }
}