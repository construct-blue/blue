import {html, LitElement} from "lit";
import {customElement, query} from "lit/decorators.js";
import TrainSearchClient from "../../Client/TrainSearchClient";
import "../../Component/Common/SearchForm"

@customElement('ts-station')
class Station extends LitElement {
    private client = new TrainSearchClient(document.body.dataset.api)

    @query('input')
    private input: HTMLInputElement

    private keyword: string = ''

    private results

    private search() {
        this.keyword = this.input.value

    }


    protected render() {
        return html`
            <ts-search-form></ts-search-form>
        `
    }
}