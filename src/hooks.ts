import { HookableComponent } from "./HookableComponent";
import { Context } from "react";

export interface State<T> {
  get(): T;
  set(v: T): void;
}

/**
 * Emulates `useState` against a {@link HookableComponent}.
 *
 * This uses the `HookableComponent.hookState` to hold a different slice of state
 * per useState caller.
 *
 * It's a little different than `useState` because the return type is not `[T, Setter<T>]`
 * but `State<T>`, b/c its expected that this class-based version of the hook would be called
 * in the component constructor/field initialization and not in the middle of `render`.
 */
export function useState<T>(component: HookableComponent, def?: T): State<T> {
  const hookId = component.newHookId();
  const stateKey = `hook-${hookId}`;
  if (def) {
    component.hookState[stateKey] = def;
  }
  return {
    get(): T {
      return component.hookState[stateKey];
    },
    set(v: T): void {
      component.hookState[stateKey] = v;
      component.forceUpdate();
    }
  };
}

/**
 * Emulates `useEffect` against a {@link HookableComponent}.
 *
 * Most of this is deferred to the HookableComponent implementation, this is just a wrapper
 * method to push the caller's `effect` onto the list of effects to run.
 */
export function useEffect(component: HookableComponent, effect: () => void): void {
  component.addEffect(effect);
}

export function useContext<T>(Context: Context<T>): T {
  return (Context as any)._currentValue;
}
