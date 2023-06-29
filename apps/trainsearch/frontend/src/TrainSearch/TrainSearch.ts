import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, state} from "lit/decorators.js";
import {TrainSearchController} from "./TrainSearchController";

@customElement('train-search')
export class TrainSearch extends LitElement {
    private controller = new TrainSearchController(this)

    @state()
    private train = null

    static styles = css`
      pre {
          overflow: scroll;
          height: 300px;
      }
    `

    protected render(): TemplateResult {
        return html`
            <input type="text" placeholder="Search" @change="${this.search}">
            <pre>${JSON.stringify(this.train, null, 2)}</pre>
        `;
    }

    private async search(e: Event)
    {
        const input = e.target as HTMLInputElement

        this.train = await this.controller.trip(input.value)
    }
}