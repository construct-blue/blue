import {html, LitElement} from "lit";
import {customElement, state} from "lit/decorators.js";
import TrainSearchClient from "../../Client/TrainSearchClient";
import "../../Component/Common/SearchForm"
import {SearchSuggestion} from "../../Component/Common/SearchInput";
import {SearchFormEvent} from "../../Component/Common/SearchForm";

@customElement('ts-station')
class Station extends LitElement {
    private client = new TrainSearchClient(document.body.dataset.api)
    private abortController = new AbortController()

    @state()
    private suggestions: SearchSuggestion[] = []

    @state()
    private stationName: string = '';

    protected render() {
        return html`
            <ts-search-form .suggestions="${this.suggestions}" @suggest="${this.onSuggest}" @change="${this.onChange}"></ts-search-form>
            <h1>${this.stationName}</h1>
        `
    }

    private async onSuggest(event: SearchFormEvent) {
        if (!event.value) {
            this.suggestions = []
            return;
        }
        this.abortController.abort()
        this.abortController = new AbortController()
        this.suggestions = await this.client.location(event.value, event.uicPrefix, event.profile, this.abortController)
    }

    private async onChange(event: SearchFormEvent)
    {
        this.stationName = event.value
    }
}