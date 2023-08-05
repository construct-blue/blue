import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {datetime} from "../../Directive/DateTime";
import {Stopover} from "../../Models/Trip";

@customElement('ts-stopover-time')
class StopoverTime extends LitElement {

    @property({type: Object})
    public stopover: Stopover


    static styles = css`
      :host(ts-stopover-time) {
        display: inline-flex;
      }

      span {
        display: flex;
        align-items: center;
      }

      .red, .green {
        font-size: 2.5rem;
        line-height: 0;
      }

      .red {
        color: var(--red);
      }

      .green {
        color: var(--green);
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
        if (this.stopover.requestStop) {
            result.push(html`&#10005;`)
        } else if (this.stopover.arrival) {
            result.push(this.renderTimeInfo(this.stopover.arrival, this.stopover.plannedArrival, this.stopover.arrivalDelay, this.stopover.reported))
        }

        if (this.stopover.departure) {
            if (result.length) {
                result.push(html`&nbsp;-&nbsp;`)
            }
            result.push(this.renderTimeInfo(this.stopover.departure, this.stopover.plannedDeparture, this.stopover.departureDelay, this.stopover.reported))
        }

        return result;
    }


    private renderTimeInfo(current, planned, delay, reported) {
        const result = []
        if (delay && reported) {
            result.push(html`
                <span class="red">•</span>&nbsp;
                <s>${datetime(planned, "time")}</s>&nbsp;/&nbsp;${datetime(current, "time")}&nbsp;
                <span class="delay">(+${delay / 60})</span>`)
        } else if (reported) {
            result.push(html`
                <span class="green">•</span>&nbsp;${datetime(current, "time")}
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