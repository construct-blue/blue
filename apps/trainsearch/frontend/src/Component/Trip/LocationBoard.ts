import {css, html, LitElement, PropertyValues} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {Stop} from "../../Models/Stop";
import './TripList'
import './TripDetails'
import '../Common/ReloadButton'
import '../Common/FavoriteButton'
import {TripEvent} from "./TripList";
import {LocationBoardController} from "./LocationBoardController";
import {Client} from "../../Client/Client";

@customElement('ts-location-board')
class LocationBoard extends LitElement {
    @property({type: Object})
    public location!: Stop

    @property({type: String})
    public profile!: string;

    private controller!: LocationBoardController

    protected willUpdate(_changedProperties: PropertyValues) {
        super.willUpdate(_changedProperties);
        if (_changedProperties.size) {
            this.controller = new LocationBoardController(
                    this,
                    new Client(document.body.dataset.api ?? ''),
                    this.profile,
                    this.location
            )
        }
    }

    static styles = css`
      :host(ts-location-board) {
        display: flex;
        flex-direction: column;
        overflow: auto;
        gap: .5rem;
      }

      h1 {
        margin: .5rem 0;
      }

      button {
        display: flex;
        font-size: 1rem;
        text-align: center;
        background: var(--dark-grey);
        border: none;
        color: #fff;
        border-radius: 4px;
        padding: .5rem;
      }

      span {
        display: flex;
        gap: .5rem;
        justify-content: space-between;
      }

      span > span {
        margin-left: auto;
      }
    `


    protected render() {
        if (this.controller.selectedTrip) {
            return html`
                <ts-details .trip="${this.controller.selectedTrip}" profile="${this.profile}">
                <span>
                    <button @click="${() => this.controller.onBack()}">&larr; ${this.location?.name ? this.location.name : 'Zurück'}</button>
                    <span style="gap: .5rem">
                        <ts-favorite-button @click="${() => this.controller.onFavorite()}" ?added="${this.controller.isFavorite()}"></ts-favorite-button>
                        <ts-reload-button @click="${() => this.controller.onRefresh()}"
                                          ?loading="${this.controller.loading}">
                        </ts-reload-button>
                    </span>
                </span>
                </ts-details>
            `
        }

        return html`
            <h1>${this.location?.name}</h1>
            <span>
                <slot></slot>
                <span>
                    <ts-favorite-button @click="${() => this.controller.onFavorite()}" ?added="${this.controller.isFavorite()}"></ts-favorite-button>
                    <ts-reload-button @click="${() => this.controller.onRefresh()}"
                                      ?loading="${this.controller.loading}">
                    </ts-reload-button>
                </span>
            </span>
            <ts-trip-list .trips="${this.controller.departures}"
                          @select="${(e: TripEvent) => this.controller.onSelect(e)}"></ts-trip-list>
        `
    }
}