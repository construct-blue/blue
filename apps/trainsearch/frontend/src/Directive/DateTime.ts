import { Directive, directive } from 'lit/async-directive.js';

class DateTime extends Directive {
    render(dateTime: string, mode?: "date"|"time"): unknown {
        const date = new Date(dateTime)
        if (mode === "date") {
            return date.toLocaleDateString(undefined, {dateStyle: "medium"})
        }
        if (mode === "time") {
            return date.toLocaleTimeString(undefined, {timeStyle: "short"})
        }
        return date.toLocaleString(undefined, {dateStyle: "medium", timeStyle: "short"});
    }
}

export const datetime = directive(DateTime)

