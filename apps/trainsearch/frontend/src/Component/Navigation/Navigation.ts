import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";


@customElement('ts-nav')
class Navigation extends LitElement {
    protected render(): TemplateResult {
        return html`
            <nav>
                <ul>
                    <li><a href="/">Zug</a></li>
                    <li><a href="/station">Abfahrten</a></li>
                </ul>
            </nav>
        `;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        this.shadowRoot.querySelectorAll('a').forEach(anchor => {
            if (anchor.getAttribute('href') === window.location.pathname) {
                anchor.classList.add('selected')
            }
        })
    }

    static styles = css`
        nav {
            background: var(--dark-grey);
            color: #d3d3d3;
            font-family: FrutigerNextPro-Bold, sans-serif;
            height: 3rem;
            display: flex;
        }

        ul {
            margin: 0;
            padding: 0;
            list-style: none;
            display: flex;
            justify-content: space-evenly;
            flex-grow: 1;
            align-items: center;
        }

        li {
            flex-grow: 1;
            text-align: center;
        }

        a {
            display: block;
            text-decoration: none;
        }

        a:visited {
            color: inherit;
        }

        a.selected {
            color: var(--red);
        }
    `
}