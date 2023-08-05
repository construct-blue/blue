import {Directive, directive} from 'lit/async-directive.js';
import {Line} from "../Models/Trip";
import {html, nothing} from "lit";

class LineName extends Directive {
    render(line: Line) {
        return html`
            ${line.category}&nbsp;${line.number}${line.number !== line.id ?
                    html`&nbsp;<small>${line.id}</small>` : nothing}${line.trainName ?
                    html`&nbsp;<small>${line.trainName}</small>` : nothing}`
    }
}

export const lineName = directive(LineName)