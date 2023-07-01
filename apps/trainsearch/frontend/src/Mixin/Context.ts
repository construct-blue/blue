import {consume, Context, provide} from "@lit-labs/context";
import {LitElement, ReactiveElement} from "lit";
import {state} from "lit/decorators.js";

type Constructor<T = {}> = new (...args: any[]) => T;

class ContextProxy<TContext extends object> implements ProxyHandler<TContext> {
    constructor(private host: ReactiveElement) {
    }

    set(target: TContext, p: string | symbol, newValue: any, receiver: any): boolean {
        target[p] = newValue
        this.host.requestUpdate()
        return true;
    }
}

export function ObjectContextConsumer<TSuper extends Constructor<LitElement>>(superClass: TSuper) {
    return function <TContext extends object> (context: Context<unknown, TContext>) {
        class ObjectContextConsumer extends superClass {
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
        class ObjectContextProvider extends superClass {
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
