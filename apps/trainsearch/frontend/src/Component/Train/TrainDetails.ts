import {css, html, LitElement, nothing, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {Trip} from "../../Models/Trip";
import "./Timetable"
import "./Remarks"
import "../Common/Collapsable"
import {datetime} from "../../Directive/DateTime";
import {lineName} from "../../Directive/LineName";
import {Favorites} from "../../Models/Favorites";

declare global {
    interface HTMLElementTagNameMap {
        "ts-details": TrainDetails;
    }
}


@customElement('ts-details')
class TrainDetails extends LitElement {
    @property()
    public trip: Trip

    @property({type: String, attribute: 'station-id'})
    public stationId: string = ''

    @property()
    public profile: string

    static styles = css`
      :host(ts-details) {
        overflow: scroll;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0;
      }

      h2 {
        display: flex;
        justify-content: space-between;
      }

      h2, h3 {
        margin: 0;
      }

      small {
        color: var(--grey)
      }

      button {
        font-size: 1rem;
        background: var(--dark-grey);
        border: none;
        color: #fff;
        border-radius: 4px;
        padding: .25rem;
      }
    `

    protected render(): TemplateResult {
        return html`
            <h2><span>${lineName(this.trip.line)}</span> <small>${datetime(this.trip.date, "date")}</small></h2>
            <slot></slot>
            <ts-collapsable summary="Fahrplan" id="timetable">
                <ts-timetable .trip="${this.trip}" profile="${this.profile}" station-id="${this.stationId}"></ts-timetable>
            </ts-collapsable>
            <ts-collapsable summary="Infos" id="remarks">
                <ts-remarks .remarks="${this.trip.remarks}"></ts-remarks>
            </ts-collapsable>
            ${this.trip.infos ? this.trip.infos.map(info =>
                    html`<ts-collapsable warning summary="${info.head}" id="${info.id}">${info.text}</ts-collapsable>`) : nothing}
        `;
    }
}