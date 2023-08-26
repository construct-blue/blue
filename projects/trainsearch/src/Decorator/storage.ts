import {decorateProperty} from '@lit/reactive-element/decorators/base.js';
import {ReactiveController, ReactiveElement} from "lit";

export type StorageOptions = {
    key?: string
    prefix?: string
    serialize?: (value: unknown) => string
    unserialize?: (value: string) => unknown
    parse?: (value: unknown) => unknown
    useId?: boolean
}

const buildKey = (host: ReactiveElement, property: PropertyKey, options?: StorageOptions) => {
    let id = null
    if (options?.useId && 'id' in host) {
        id = host.id
    }
    return `${options?.prefix || host.constructor.name}_${options?.key || String(property)}${id ? `_${id}` : ''}`
}

class StorageController implements ReactiveController {
    private key!: string

    constructor(private host: ReactiveElement, private property: PropertyKey, private descriptor: PropertyDescriptor, private options?: StorageOptions) {
        host.addController(this)
    }

    hostConnected() {
        this.updateValue()
    }

    private keyChanged() {
        return this.key !== buildKey(this.host, this.property, this.options)
    }

    private updatedKey(): string {
        return this.key = buildKey(this.host, this.property, this.options)
    }

    private updateValue() {
        const value = localStorage.getItem(this.updatedKey())
        if (value && this.descriptor?.set) {
            const unserializedValue = this.options?.unserialize ? this.options.unserialize(value) : JSON.parse(value);
            this.descriptor.set.call(this.host, this.options?.parse ? this.options.parse(unserializedValue) : unserializedValue)
        }
    }

    hostUpdate() {
        if (this.keyChanged()) {
            this.updateValue();
        }
    }
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
            const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, property)
            if (!descriptor) {
                throw new Error('@storage decorator needs to be called before @property')
            }

            ctor.addInitializer((host: ReactiveElement) =>
                new StorageController(host, property, descriptor, options))

            Object.defineProperty(ctor.prototype, property, {
                ...descriptor,
                set: function (this: ReactiveElement, value: unknown) {
                    if (descriptor?.set) {
                        descriptor.set.call(this, value)
                    }

                    if (this.isConnected && value !== undefined) {
                        localStorage.setItem(buildKey(this, property, options), options?.serialize ? options.serialize(value) : JSON.stringify(value));
                    }
                }
            });
        }
    })
}
