import {css, html, LitElement} from "lit";
import {customElement, property, state} from "lit/decorators.js";
import {classMap} from "lit/directives/class-map.js";

@customElement('ts-reload-button')
class ReloadButton extends LitElement {
    @property({type: Boolean})
    public loading: boolean = false;

    @state()
    public clicked = false;

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
        
        .loading {
            color: var(--grey)
        }

        @keyframes clicked {
            0% {
                color: var(--dark-grey);
                background: var(--grey);
            }
            100% {
                color: inherit;
                background: var(--dark-grey);
            }
        }

        .clicked {
            animation-delay: .1s;
            animation: clicked 1s ease-out forwards;
        }
    `

    protected render() {
        return html`
            <button class="${classMap({clicked: this.clicked})}" @animationend="${this.onAnimationEnd}"
                    @click="${this.onClick}">
                <span class="${classMap({loading: this.loading})}">
                    &circlearrowright;
                </span>
            </button>`;
    }

    private onClick() {
        this.clicked = true;
    }

    private onAnimationEnd() {
        this.clicked = false
    }
}