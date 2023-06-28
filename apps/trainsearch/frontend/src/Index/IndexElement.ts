import {html, LitElement, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";

@customElement('index-element')
class IndexElement extends LitElement {
    protected render(): TemplateResult {
        return html`<h1>Hello world!</h1>`;
    }
}