import {getReal, isProxy, ObjectContextConsumer, ObjectContextProvider} from "../../src/Mixin/ObjectContext";
import {html, LitElement, TemplateResult} from "lit";
import {createContext} from "@lit-labs/context";
import {customElement, queryAsync} from "lit/decorators.js";

class PersonContext
{
    name: string
    address: string
}

const personContext = createContext<PersonContext>('personContext')

@customElement('test-person')
class Person extends ObjectContextProvider(LitElement)(personContext, new PersonContext()) {
    @queryAsync('test-person-name')
    public personName: Promise<PersonName>
    @queryAsync('test-person-address')
    public personAddress: Promise<PersonAddress>

    protected render(): TemplateResult {
        return html`
            <test-person-name></test-person-name>
            <test-person-address></test-person-address>
        `;
    }
}

@customElement('test-person-name')
class PersonName extends ObjectContextConsumer(LitElement)(personContext) {
}


@customElement('test-person-address')
class PersonAddress extends ObjectContextConsumer(LitElement)(personContext) {
}

describe('ObjectContext Mixin', () => {
    test('should proxy the context and observe changes', async () => {
        document.body.innerHTML = `
            <test-person></test-person>
        `
        const person = document.querySelector('test-person') as Person
        const personName = await person.personName
        const personAddress = await person.personAddress

        personName.context.name = 'Max Mustermann'
        expect(personAddress.context.name).toBe('Max Mustermann')
    });
    test('should not proxy the proxy', async () => {
        document.body.innerHTML = `
            <test-person></test-person>
        `
        const person = document.querySelector('test-person') as Person

        person.context = person.context
        person.context = person.context

        expect(person.context[getReal]).toBeInstanceOf(PersonContext)
        expect(person.context[getReal][isProxy]).toBeUndefined()
    });
});