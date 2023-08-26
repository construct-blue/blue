import {css, html, LitElement, PropertyValues} from "lit";
import {customElement, property, query} from "lit/decorators.js";

declare global {
    interface HTMLElementTagNameMap {
        "ts-select": Select;
    }
}

interface SelectEventInit extends EventInit {
    value: string
}

export class SelectEvent extends Event {
    public value: string

    constructor(type: string, eventInitDict: SelectEventInit) {
        super(type, eventInitDict);
        this.value = eventInitDict.value
    }
}

@customElement('ts-select')
class Select extends LitElement {
    @property({type: Object})
    public options: { id: string, name: string }[] = []

    @property({type: String})
    public value: string  = ''

    @query('select')
    private input!: HTMLSelectElement

    static styles = css`
      :host(ts-select) {
        display: flex;
      }

      select {
        font-size: 1rem;
        padding: .5rem;
        color: inherit;
        background: #2a2a2a;
        border-radius: .25rem;
        border: none;
      }
    `

    private onChange(e: Event) {
        e.stopPropagation()
        this.value = this.input?.value ?? ''
        this.dispatchEvent(new SelectEvent(
                'change',
                {composed: true, bubbles: true, value: this.input?.value ?? ''}
        ))
    }

    protected render() {
        return html`
            <select @change="${this.onChange}">
                ${this.options.map(value => html`
                    <option value="${value.id}">${value.name}</option>`
                )}
            </select>
        `
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        if (this.input) {
            this.input.value = this.value
        }
    }
}