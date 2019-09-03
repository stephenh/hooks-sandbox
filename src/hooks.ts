import { HookableComponent } from "./HookableComponent";

export type Getter<T> = () => T;
export type Setter<T> = (t: T) => void;

/**
 * Emulates `useState` against a {@link HookableComponent}.
 *
 * This uses the `HookableComponent.hookState` to hold a different slice of state
 * per useState caller.
 *
 * It's a little different than `useState` because the return type if not `[T, Setter<T>]`
 * but `[Getter<T>, Setter<T>]`, b/c its expected that this class-conversion of the hook
 * would be called in the component constructor/field initialization and not in the middle
 * of `render`.
 *
 * Really it might be simpler to just return a `State<T>` with a `get` and `set` methods
 * on it, but for now keeping the tuple return type to more closely match the original
 * `useState`.
 */
export function useState<T>(component: HookableComponent, def?: T): [Getter<T>, Setter<T>] {
  const hookId = component.newHookId();
  const stateKey = `hook-${hookId}`;
  if (def) {
    component.hookState[stateKey] = def;
  }
  const getter = () => component.hookState[stateKey];
  const setter = (v: T) => {
    component.hookState[stateKey] = v;
    component.forceUpdate();
  };
  return [getter, setter];
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