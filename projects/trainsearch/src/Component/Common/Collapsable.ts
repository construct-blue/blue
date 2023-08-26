import {css, html, LitElement, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";
import {classMap} from "lit/directives/class-map.js";
import {storage} from "../../Decorator/storage";

@customElement('ts-collapsable')
class Collapsable extends LitElement {
    @property()
    public summary: string = ''

    @storage({useId: true})
    @property({type: Boolean})
    public open: boolean = false

    @property({type: Boolean})
    public warning: boolean = false

    static styles = css`
        summary {
            padding: .5rem;
            background: var(--dark-grey);
            border-bottom: var(--light-border);
        }

        summary.warning {
            background: var(--orange);
            color: var(--dark-grey);
        }
        
        details {
            overflow: hidden;
        }

        details[open], details:not([open]) summary {
            border: var(--light-border);
            border-radius: 5px;
        }
        
        details > section {
            padding: .5rem;
        }
    `

    protected render(): TemplateResult {
        return html`
            <details ?open="${this.open}" @toggle="${(e: Event) => this.open = (e.target as HTMLDetailsElement).open}">
                <summary class="${classMap({warning: this.warning})}">${this.summary}</summary>
                <section>
                    <slot></slot>
                </section>
            </details>
        `;
    }
}