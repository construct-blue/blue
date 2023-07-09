import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "./TrainNumberContext";
import {Trip} from "./Models/Trip";
import "./Timetable"
import "./Remarks"
import "./Collapsable"
import {datetime} from "../../Directive/DateTime";
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
            <h2>${this.trip.line.name} <small style="color: var(--grey)">${datetime(this.trip.date, "date")}</small></h2>
            <ts-collapsable summary="Fahrplan" id="timetable">
                <ts-timetable .trip="${this.trip}"></ts-timetable>
            </ts-collapsable>
            <ts-collapsable summary="Infos" id="remarks">
                <ts-remarks .remarks="${this.trip.remarks}"></ts-remarks>
            </ts-collapsable>
        `;
    }
}