import { Component, Context, MutableRefObject } from "react";

export interface State<T> {
  get(): T;
  set(v: T): void;
}

/**
 * Emulates the `useState` hook against a {@link Component}.
 *
 * This API is a little different than `useState` because the return type is not `[T, Setter<T>]`
 * but `State<T>`, b/c its expected that this class-based version of the hook would be instantiated
 * once in the component's constructor/field initialization and not in the middle of `render`.
 *
 * Hence the component is responsible for always getting the current value by calling `.get()`.
 */
export function newState<T>(component: Component): State<T | undefined>;
export function newState<T>(component: Component, initial: T): State<T>;
export function newState<T>(component: Component, initial?: T): State<T | undefined> {
  let value: T | undefined = initial;
  return {
    get(): T | undefined {
      return value;
    },
    set(v: T): void {
      value = v;
      component.forceUpdate();
    },
  };
}

/**
 * Emulates the `useEffect` hook against a {@link Component}.
 *
 * Most of this is deferred to the EffectsHolder implementation, this is just a wrapper
 * method to push the caller's `effect` onto the list of effects to run.
 */
export function newEffect(component: Component, effect: () => void, deps: any[] = []): void {
  // TODO Use/implement deps handling/tracking.
  EffectsHolder.for(component).effects.push(effect);
}

class EffectsHolder {
  readonly effects: Array<Function> = [];
  private cleanUpFns: Array<Function> = [];

  /** Globs an EffectsHolder onto `component. */
  static for(component: any): EffectsHolder {
    if (component.__effectsHolder === undefined) {
      component.__effectsHolder = new EffectsHolder(component);
    }
    return component.__effectsHolder;
  }

  constructor(component: Component) {
    wrap(component, "componentDidMount", this.cancelAndRunEffects);
    wrap(component, "componentDidUpdate", this.cancelAndRunEffects);
  }

  private cancelAndRunEffects = () => {
    // Each time we run, invoke the last run's clean up functions
    this.cleanUpFns.forEach(e => e());
    this.cleanUpFns = this.effects.map(e => e.call(undefined)).filter(e => e instanceof Function);
  };
}

/**
 * Invokes `fn` before `o.methodName` is called (whether `methodName` does or does not exist on `o`).
 *
 * This is basically a way of hooking into a component's existing lifecycle method.
 */
function wrap<T, K extends keyof T>(o: T, methodName: K, fn: () => void) {
  const maybeOriginalMethod = o[methodName];
  o[methodName] = function(this: T) {
    fn();
    if (maybeOriginalMethod) {
      return (maybeOriginalMethod as any).apply(this, arguments);
    }
  } as any;
}

/**
 * Emulates the `useRef` hook.
 *
 * Given class-based hooks are only created once on instantiation, we don't need any
 * magic. If anything we should just remove this, but keeping it for simplicity of porting
 * other hooks over.
 *
 * ...do we even need this given that React.createRef exists?
 */
export function newRef<T>(): MutableRefObject<T | undefined> {
  return { current: undefined };
}

/**
 * Emulates the `useContext` hook, i.e. allows easy programmatic access to the context value.
 *
 * Note that when the context value changes, all children components will be re-rendered, and
 * this return value will be the new context value, which means basically you should not keep
 * references to this return value, and instead make sure you re-call getContext on each use.
 */
export function getContext<T>(context: Context<T>): T {
  // This is horribly broken in real
  // import {isPrimaryRenderer} from './ReactFiberHostConfig';
  // Context.Consumer._currentValue;
  return (context as any)._currentValue;
}
