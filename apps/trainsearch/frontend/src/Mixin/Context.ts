import {consume, Context, provide} from "@lit-labs/context";
import {LitElement} from "lit";
import {state} from "lit/decorators.js";

type Constructor<T = {}> = new (...args: any[]) => T;

interface ContextAwareElement<TContext> {
    get context(): TContext
    set context(context: TContext)
}

class ContextProxy<TContext extends object> implements ProxyHandler<TContext> {
    constructor(private host: ContextAwareElement<TContext>) {
    }

    set(target: TContext, p: string | symbol, newValue: any, receiver: any): boolean {
        target[p] = newValue
        this.host.context = target
        return true;
    }
}

export function ObjectContextConsumer<TSuper extends Constructor<LitElement>>(superClass: TSuper) {
    return function <TContext extends object> (context: Context<unknown, TContext>) {
        class ObjectContextConsumer extends superClass implements ContextAwareElement<TContext> {
            @consume({context: context, subscribe: true})
            private _context: TContext

            protected updateContext(context: TContext): void {
                this.context = context
            }

            get context(): TContext {
                return this._context;
            }

            set context(value: TContext) {
                this._context = new Proxy(value, new ContextProxy(this));
            }
        }

        return ObjectContextConsumer as Constructor<ObjectContextConsumer> & TSuper;
    }
}

export function ObjectContextProvider<TSuper extends Constructor<LitElement>>(superClass: TSuper) {
    return function <TContext extends object> (context: Context<unknown, TContext>, contextValue: TContext) {
        class ObjectContextProvider extends superClass implements ContextAwareElement<TContext> {
            @provide({context: context})
            @state()
            private _context: TContext = new Proxy(contextValue, new ContextProxy(this))

            get context(): TContext {
                return this._context;
            }

            set context(value: TContext) {
                this._context = new Proxy(value, new ContextProxy(this))
            }
        }

        return ObjectContextProvider as Constructor<ObjectContextProvider> & TSuper;
    }
}
