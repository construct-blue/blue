import {consume, Context, provide} from "@lit-labs/context";
import {LitElement} from "lit";
import {state} from "lit/decorators.js";

type Constructor<T = {}> = new (...args: any[]) => T;
export const isProxy = Symbol("isProxy")
export const getReal = Symbol("getReal")
export const updateContext = Symbol("updateContext")

interface ContextAwareElement<TContext> {
    set context(context: TContext)
}

class ContextProxy<TContext extends object> implements ProxyHandler<TContext> {
    constructor(private host: ContextAwareElement<TContext>) {
    }

    set(target: TContext, p: string | symbol, newValue: any, receiver: any): boolean {
        if (p !== updateContext) {
            target[p] = newValue
        }
        this.host.context = target
        return true;
    }

    get(target: TContext, p: string | symbol, receiver: any): any {
        if (p === isProxy) {
            return true
        }
        if (p === getReal) {
            return target
        }
        return target[p]
    }
}

export function ObjectContextConsumer<TSuper extends Constructor<LitElement>>(superClass: TSuper) {
    return function <TContext extends object>(context: Context<unknown, TContext>) {
        class ObjectContextConsumer extends superClass {
            @consume({context: context, subscribe: true})
            private _context: TContext

            get context(): TContext {
                return this._context;
            }

            public updateContext()
            {
                this.context[updateContext] = true;
            }
        }

        return ObjectContextConsumer as Constructor<ObjectContextConsumer> & TSuper;
    }
}

export function ObjectContextProvider<TSuper extends Constructor<LitElement>>(superClass: TSuper) {
    return function <TContext extends object>(context: Context<unknown, TContext>, contextValue?: TContext) {
        class ObjectContextProvider extends superClass implements ContextAwareElement<TContext> {
            @provide({context: context})
            @state()
            protected _context: TContext = contextValue ? new Proxy(contextValue, new ContextProxy(this)) : undefined

            get context(): TContext {
                return this._context;
            }

            set context(value: TContext) {
                if (value[isProxy]) {
                    this._context = value
                } else {
                    this._context = new Proxy(value, new ContextProxy(this))
                }
            }
        }

        return ObjectContextProvider as Constructor<ObjectContextProvider> & TSuper;
    }
}
