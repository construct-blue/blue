import {css, html, LitElement, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";
import '../TrainSearch/TrainSearch'

@customElement('index-element')
class IndexElement extends LitElement {
    static styles = css`
      :host {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        box-sizing: border-box;
      }

      *, *:before, *:after {
        box-sizing: border-box;
      }
    `

    protected render(): TemplateResult {
        return html`
            <h1>TrainSearch</h1>
            <section>
                <train-search></train-search>
            </section>
        `;
    }
}