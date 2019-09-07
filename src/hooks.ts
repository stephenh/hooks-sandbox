import { Component, Context, MutableRefObject } from "react";

export interface State<T> {
  get(): T;
  set(v: T): void;
}

/**
 * Emulates `useState` against a {@link Component}.
 *
 * It's a little different than `useState` because the return type is not `[T, Setter<T>]`
 * but `State<T>`, b/c its expected that this class-based version of the hook would be called
 * in the component constructor/field initialization and not in the middle of `render`.
 */
export function useState<T>(component: Component): State<T | undefined>;
export function useState<T>(component: Component, initial: T): State<T>;
export function useState<T>(
  component: Component,
  initial?: T
): State<T | undefined> {
  let value: T | undefined = initial;
  return {
    get(): T | undefined {
      return value;
    },
    set(v: T): void {
      value = v;
      component.forceUpdate();
    }
  };
}

/**
 * Emulates `useEffect` against a {@link Component}.
 *
 * Most of this is deferred to the EffectsHolder implementation, this is just a wrapper
 * method to push the caller's `effect` onto the list of effects to run.
 */
export function useEffect(component: Component, effect: () => void): void {
  EffectsHolder.for(component).effects.push(effect);
}

class EffectsHolder {
  readonly effects: Array<Function> = [];
  lastEffects: Array<Function> = [];

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
    this.lastEffects.forEach(e => e());
    this.lastEffects = this.effects
      .map(e => e())
      .filter(e => e instanceof Function);
  };
}

function wrap<T, K extends keyof T>(o: T, methodName: K, fn: () => void) {
  const original = o[methodName];
  o[methodName] = function(this: T) {
    fn();
    if (original) {
      return (original as any).apply(this, arguments);
    }
  } as any;
}

/**
 * Emulates `useRef`.
 *
 * Given class-based hooks are only created once on instantiation, we don't need any
 * magic. If anything we should just remove this, but keeping it for simplicity of porting
 * other hooks over.
 */
export function useRef<T>(): MutableRefObject<T | undefined> {
  return { current: undefined };
}

/**
 * Emulates `useContext`.
 *
 * Currently doesn't re-render the component when the Context changes.
 */
export function useContext<T>(Context: Context<T>): T {
  return (Context as any)._currentValue;
}
