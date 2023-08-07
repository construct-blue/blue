import {css, html, LitElement} from "lit";
import {customElement, property} from "lit/decorators.js";
import {classMap} from "lit/directives/class-map.js";

@customElement('ts-reload-button')
class ReloadButton extends LitElement {
    @property({type: Boolean})
    public loading: boolean = false;

    static styles = css`
      button {
        display: flex;
        font-size: 1rem;
        text-align: center;
        background: var(--dark-grey);
        border: none;
        color: #fff;
        border-radius: 4px;
        padding: .5rem;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .spin {
        animation: spin 2s linear infinite;
      }
    `
    protected render() {
        return html`<button><span class="${classMap({spin: this.loading})}">&circlearrowright;</span></button>`;
    }
}