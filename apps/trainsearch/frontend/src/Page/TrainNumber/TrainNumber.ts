import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, state} from "lit/decorators.js";
import {TrainNumberController} from "./TrainNumberController";
import './NumberInput'
import {TrainNumberContext, trainNumberContext} from "./TrainNumberContext";
import {ObjectContextProvider} from "../../Mixin/Context";

@customElement('ts-number')
export class TrainNumber extends ObjectContextProvider(LitElement)(trainNumberContext, new TrainNumberContext()) {
    private controller = new TrainNumberController(this)

    static styles = css`
      pre {
          overflow: scroll;
          height: 300px;
      }
    `

    protected render(): TemplateResult {
        return html`
            <ts-number-input></ts-number-input>
            <span>${this.context.operator}</span>
            <pre>${JSON.stringify(this.context.train, null, 2)}</pre>
        `;
    }

    private async search(e: Event)
    {
        const input = e.target as HTMLInputElement

        this.context.train = await this.controller.trip(input.value)
    }
}