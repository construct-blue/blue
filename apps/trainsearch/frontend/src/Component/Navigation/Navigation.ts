import {html, LitElement, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";


@customElement('ts-nav')
class Navigation extends LitElement {
    protected render(): TemplateResult {
        return html`
            <nav>
                <ul>
                    <li><a href="/">Zug Nr.</a></li>
                </ul>
            </nav>
        `;
    }
}