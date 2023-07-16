import {css, html, LitElement, nothing, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "../../Page/TrainNumber/TrainNumberContext";
import {Trip} from "../../Models/Trip";
import "./Timetable"
import "./Remarks"
import "../Common/Collapsable"
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

      h2, h3 {
        margin: 0;
      }

      small {
        color: var(--grey)
      }
    `

    protected render(): TemplateResult {
        return html`
            <h2>${this.trip.line.name} <small>${datetime(this.trip.date, "date")}</small></h2>
            ${this.trip.line.trainName ? html`<h3>${this.trip.line.trainName}</h3>` : nothing}
            <ts-collapsable summary="Fahrplan" id="timetable">
                <ts-timetable .trip="${this.trip}"></ts-timetable>
            </ts-collapsable>
            <ts-collapsable summary="Infos" id="remarks">
                <ts-remarks .remarks="${this.trip.remarks}"></ts-remarks>
            </ts-collapsable>
        `;
    }
}