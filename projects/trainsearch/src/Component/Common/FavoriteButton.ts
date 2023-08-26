import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";

@customElement('ts-favorite-button')
class FavoriteButton extends LitElement {
    @property({type: Boolean})
    public added = false


    static styles = css`
      button {
        display: flex;
        font-size: 1rem;
        text-align: left;
        background: var(--dark-grey);
        border: none;
        color: #fff;
        border-radius: 4px;
        padding: .5rem;
      }
    `

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