import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "./TrainNumberContext";
import {Trip} from "./Models/Trip";
import "./Timetable"
import "./Remarks"
@customElement('ts-details')
class TrainDetails extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    @property()
    public trip: Trip

    static styles = css`
      :host(ts-details) {
        overflow: scroll;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0;
      }

      h2 {
        margin: 0;
      }
    `

    protected render(): TemplateResult {
        return html`
            <h2>${this.trip.line.name}</h2>
            <ts-timetable .trip="${this.trip}"></ts-timetable>
            <ts-remarks .trip="${this.trip}"></ts-remarks>
        `;
    }
}