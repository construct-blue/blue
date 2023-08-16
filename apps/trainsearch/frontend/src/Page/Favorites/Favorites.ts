import {css, html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import '../../Component/Trip/TripList'
import '../../Component/Trip/TripDetails'
import "../../Component/Common/ReloadButton"

@customElement('ts-favorites')
class Favorites extends LitElement {
    static styles = css`
        :host(ts-home) {
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }

        h1 {
            margin: .5rem 0;
        }

        h2 {
            display: flex;
            margin: .25rem 0;
        }

        i {
            width: 2rem;
        }

        div {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            overflow: scroll;
            padding: .5rem 0;
        }

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

        i {
            width: 2rem;
            align-self: end;
            text-align: center;
        }

        span {
            display: flex;
            justify-content: space-between;
        }

        small {
            color: var(--grey)
        }
    `

    protected render() {
        return html`
            <h1>&starf; Favoriten</h1>
            <div>
                <h2><i style="font-family: mav-symbols">ȫ</i>&nbsp;Abfahrten</h2>
                <h2><i style="font-family: oebb-symbols">–</i>&nbsp;Züge</h2>
            </div>
        `
    }
}