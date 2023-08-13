import {css, html, LitElement, PropertyValues, TemplateResult} from "lit";
import {customElement} from "lit/decorators.js";


@customElement('ts-nav')
class Navigation extends LitElement {
    protected render(): TemplateResult {
        return html`
            <nav>
                <ul>
                    <li><a href="/"><i>&starf;</i>Favoriten</a></li>
                    <li><a href="/train"><i style="font-family: oebb-symbols">–</i>Zug</a></li>
                    <li><a href="/station"><i style="font-family: mav-symbols">ȫ</i>Abfahrten</a></li>
                </ul>
            </nav>
        `;
    }

    protected updated(_changedProperties: PropertyValues) {
        super.updated(_changedProperties);
        this.shadowRoot?.querySelectorAll('a').forEach(anchor => {
            if (anchor.getAttribute('href') === window.location.pathname) {
                anchor.classList.add('selected')
            }
        })
    }

    static styles = css`
        nav {
            background: var(--dark-grey);
            padding-bottom: 2rem;
            color: #d3d3d3;
            font-family: FrutigerNextPro-Bold, sans-serif;
            font-size: 1.25rem;
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
            padding-top: .5rem;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: inherit;
        }

        a:visited {
            color: inherit;
        }

        a.selected {
            color: var(--red);
        }
    `
}