import {html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement('ts-favorite-button')
class FavoriteButton extends LitElement {
    @property({type: Boolean})
    public added = false

    protected render(): unknown {
        if (this.added) {
            return html`
                    <button style="color: yellow">&starf;</button>`
        } else {
            return html`
                    <button style="color: grey">&starf;</button>`
        }
    }
}