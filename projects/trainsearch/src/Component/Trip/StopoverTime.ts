import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {datetime} from "../../Directive/DateTime";
import {Stopover} from "../../Models/Stopover";

@customElement('ts-stopover-time')
class StopoverTime extends LitElement {

    @property({type: Object})
    public stopover: Stopover|null = null


    static styles = css`
      :host(ts-stopover-time) {
        display: inline-flex;
      }

      span {
        display: flex;
        align-items: center;
      }

      .red, .green {
        display: inline-block;
        width: .5rem;
        height: .5rem;
        border-radius: .5rem;
        align-self: center;
      }

      .red {
        background: var(--red);
      }

      .green {
        background: var(--green);
      }

      .delay {
        color: var(--orange);
        font-family: FrutigerNextPro-Bold, sans-serif;
        font-weight: bold;
      }

      s {
        color: var(--grey)
      }
    `

    protected render() {

        const result = [];
        if (this.stopover && this.stopover.requestStop) {
            result.push(html`&#10005;`)
        } else if (this.stopover && this.stopover.arrival) {
            result.push(this.renderTimeInfo(this.stopover.arrival, this.stopover.plannedArrival ?? '', this.stopover.arrivalDelay ?? 0, this.stopover.reported))
        }

        if (this.stopover && this.stopover.departure) {
            if (result.length) {
                result.push(html`&nbsp;-&nbsp;`)
            }
            result.push(this.renderTimeInfo(this.stopover.departure, this.stopover.plannedDeparture ?? '', this.stopover.departureDelay ?? 0, this.stopover.reported))
        }

        return result;
    }


    private renderTimeInfo(current: string, planned: string, delay: number, reported: boolean) {
        const result = []
        if (delay && reported) {
            result.push(html`
                <span class="red"></span>&nbsp;
                <s>${datetime(planned, "time")}</s>&nbsp;/&nbsp;${datetime(current, "time")}&nbsp;
                <span class="delay">(+${delay / 60})</span>`)
        } else if (reported) {
            result.push(html`
                <span class="green"></span>&nbsp;${datetime(current, "time")}
            `)
        } else if (delay) {
            result.push(html`
                <s>${datetime(planned, "time")}</s>&nbsp;/&nbsp;${datetime(current, "time")}&nbsp;
                <span class="delay">(+${delay / 60})</span>`)
        } else {
            result.push(html`${datetime(current, "time")}`)
        }
        return result;
    }

}