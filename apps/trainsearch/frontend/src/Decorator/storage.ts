import {decorateProperty} from '@lit/reactive-element/decorators/base.js';
import {ComplexAttributeConverter, defaultConverter, ReactiveElement} from "@lit/reactive-element";

export type StorageOptions = {
    key?: string,
    prefix?: string
}


/**
 * A decorator for syncing state values with localStorage
 *
 * A state property marked with @storage will read the value
 * from the associated localStorage item, parse it depending on
 * its type and make it available to the state.
 *
 * Anytime the state propery changes, the change is reflected
 * to localStorage.
 *
 * @storage must be placed before @property for this to work.
 *
 * @param options
 * @returns PropertySignature
 */
export function storage(options?: StorageOptions) {
    return decorateProperty({
        finisher: (ctor: typeof ReactiveElement, property: PropertyKey) => {
            const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, property);

            if (!descriptor) {
                throw new Error('@storage decorator needs to be called before @property')
            }

            const key: string = `${options?.prefix || ctor.name}_${options?.key || String(property)}`;
            const definition = ctor.elementProperties.get(property);
            const type = definition?.type ?? String

            const converter = definition?.converter
                ? definition.converter as ComplexAttributeConverter
                : defaultConverter

            const storedValue = localStorage.getItem(key)
                ? converter.fromAttribute
                    ? converter.fromAttribute(localStorage.getItem(key), type)
                    : JSON.parse(localStorage.getItem(key) as string)
                : undefined;

            ctor.addInitializer((element: ReactiveElement) => {
                if (storedValue !== undefined) {
                    (element as any)[property] = storedValue
                }
            })

            Object.defineProperty(ctor.prototype, property, {
                ...descriptor,
                set: function (this: ReactiveElement, value: unknown) {
                    if (!this.isConnected && storedValue !== undefined) {
                        value = storedValue;
                    }

                    if (descriptor?.set) {
                        descriptor.set.call(this, value)
                    }

                    if (value !== undefined && this.isConnected) {
                        const stringValue = converter.toAttribute
                            ? converter.toAttribute(value, type) as string
                            : JSON.stringify(value);

                        localStorage.setItem(
                            key,
                            stringValue
                        );
                    }
                }
            });
        }
    })
}
