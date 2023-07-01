import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {ObjectContextConsumer} from "libs/lit-helper/src/Mixin/ObjectContext";
import {trainNumberContext} from "./TrainNumberContext";

@customElement('ts-details')
class TrainDetails extends ObjectContextConsumer(LitElement)(trainNumberContext) {
    @property()
    public trip: {
        line: {
            name: string
        }
        stopovers: {
            stop: {
                id: string,
                name: string
            },
            delay?: number,
            reported: boolean
        }[]
        remarks: {
            type: string
            code: string
            prio: number
            message: string
        }[]
    }

    static styles = css`
      .warning {
          background: var(--orange);
          color: black;
      }
    `

    protected render(): TemplateResult {
        return html`
            <h2>${this.trip.line.name}</h2>
            <p>${this.trip.stopovers.map(stopover => stopover.stop.name).join(' - ')}</p>
            <p class="warning">${this.trip.remarks.map(remark => remark.message).join(' - ')}</p>
            <p></p>
        `;
    }
}