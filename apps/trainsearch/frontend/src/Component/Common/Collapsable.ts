import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement('ts-collapsable')
class Collapsable extends LitElement {
    @property()
    public summary: string

    @property()
    public open: boolean

    static styles = css`
        summary {
            padding: .5rem;
            background: var(--dark-grey);
            border-bottom: var(--light-border);
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
            <details ?open="${this.open}" @toggle="${e => this.open = e.target.open}">
                <summary>${this.summary}</summary>
                <section>
                    <slot></slot>
                </section>
            </details>
        `;
    }


    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        if (this.id) {
            this.open = this.open || localStorage.getItem(this.storageId) === 'open'
        }
    }

    get storageId(): string
    {
        return this.tagName.toLowerCase() + '-' + this.id;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (this.id) {
            if (this.open) {
                localStorage.setItem(this.storageId, 'open')
            } else {
                localStorage.removeItem(this.storageId)
            }
        }
    }
}