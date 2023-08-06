import {Directive, directive} from 'lit/async-directive.js';
import {Line} from "../Models/Trip";
import {html, nothing} from "lit";

class LineName extends Directive {
    private oebbCategories = {
        'IC': '+',
        'EC': '*',
        'EN': 'μ',
        'ER': 'Ä',
        'Bus': 'O',
        // 'RJ': '¼', used from mav
        'REX': 'Ã',
        'R': 'Æ',
        'RB': 'Æ',
        'D': 'Ç',
        'WB': 'Ø',
        'ICE': 'Å',
        'S': 'S',
    };

    private mavCategories = {
        'NJ': 'Ɵ',
        'RJ': 'Ń',
        'RJX': 'ƭ',
        'IR': 'ǝ',
        'EIC': 'ǔ',
        'EIP': 'Ǖ',
        'RE': 'ǟ',
        'ICB': 'Ø',
    };

    private formatCategory(category: string, operator: string, product: string) {
        if (category === 'R' && product === 'interregional') {
            category = 'D'
        }

        if (category === 'Os' && product === 'regional') {
            category = 'R'
        }

        if (operator == 'cd' && category == 'CD') {
            category = 'IC'
        }

        if (this.oebbCategories[category]) {
            return html`<i style="font-family: oebb-symbols">${this.oebbCategories[category]}</i>`;
        }

        if (this.mavCategories[category]) {
            return html`<i style="font-family: mav-symbols">${this.mavCategories[category]}</i>`;
        }
        return category;
    }

    render(line: Line) {
        console.log(line)
        return html`
            ${this.formatCategory(line.category, line.operator.id, line.product.id)}&nbsp;${line.number}${line.number !== line.id ?
                    html`&nbsp;<small>${line.id}</small>` : nothing}${line.trainName ?
                    html`&nbsp;<small>${line.trainName}</small>` : nothing}`
    }
}

export const lineName = directive(LineName)