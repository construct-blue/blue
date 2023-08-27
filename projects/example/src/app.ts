import {html, LitElement} from "lit";
import {customElement} from "lit/decorators.js"

@customElement('example-app')
class ExampleApp extends LitElement {
    protected render(): unknown {
        return html`<h1>Hello world!</h1><h2>This is a test</h2>`;
    }
}