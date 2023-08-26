import {customElement, property} from "lit/decorators.js";
import {html, LitElement} from "lit";

@customElement('ts-profile')
class Profile extends LitElement {
    @property({type: String})
    public profile: string = ''

    protected render(): unknown {
        if (this.profile === 'oebb') {
            return html`<i style="font-family: oebb-light-symbols">o</i>`
        }

        if (this.profile === 'db') {
            return html`<i style="font-family: oebb-light-symbols">ø</i>`
        }

        return `(${this.profile})`;
    }
}