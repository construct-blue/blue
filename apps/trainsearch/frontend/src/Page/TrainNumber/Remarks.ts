import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Remark, Trip} from "./Models/Trip";

@customElement('ts-remarks')
class Remarks extends LitElement {
    @property()
    public remarks: Remark[]

    @property({type: Boolean})
    public muted: boolean

    static styles = css`
      :host(ts-remarks) {
        display: flex;
        flex-direction: column;
        gap: .25rem;
      }

      p {
        margin: 0;
        padding: 0;
      }

      p.muted {
        color: var(--grey);
      }

      p.M {
        color: var(--orange);
      }

      p:last-of-type {
        border: none;
      }
    `

    protected render(): TemplateResult {
        return html`
            ${this.remarks.map(remark => html`<p class="${remark.type}${this.muted ? ' muted' : ''}">&#9758; ${remark.message}</p>`)}
        `;
    }
}