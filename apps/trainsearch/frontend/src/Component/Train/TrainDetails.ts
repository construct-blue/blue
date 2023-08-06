import {css, html, LitElement, nothing, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "../../Page/TrainNumber/TrainNumberContext";
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
class TrainDetails extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    @property()
    public trip: Trip

    @property({type: String, attribute: 'station-id'})
    public stationId: string = ''

    private favorites = Favorites.fromStorage(localStorage)

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
            ${this.trip.line.trainName ? html`<h3>${this.trip.line.trainName}</h3>` : nothing}
            ${this.renderFavoriteButton()}
            <ts-collapsable summary="Fahrplan" id="timetable">
                <ts-timetable .trip="${this.trip}" profile="${this.profile}" station-id="${this.stationId}"></ts-timetable>
            </ts-collapsable>
            <ts-collapsable summary="Infos" id="remarks">
                <ts-remarks .remarks="${this.trip.remarks}"></ts-remarks>
            </ts-collapsable>
        `;
    }

    private renderFavoriteButton() {
        if (this.favorites.hasLine(this.trip.line)) {
            return html`
                <button @click="${() => this.onClickDeleteToFavorites()}">Aus Favoriten löschen</button>`
        } else {
            return html`
                <button @click="${() => this.onClickAddToFavorites()}">Zu Favoriten hinzufügen</button>`
        }

    }

    private onClickAddToFavorites() {
        this.favorites.addLine(this.profile, Number.parseInt(this.trip.line.admin), this.trip.direction, this.trip.line)
        this.favorites.save(localStorage)
        this.requestUpdate()
    }

    private onClickDeleteToFavorites() {
        this.favorites.deleteLine(this.trip.line)
        this.favorites.save(localStorage)
        this.requestUpdate()
    }
}