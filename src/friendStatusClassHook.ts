import { Component } from 'react';
import { HookableComponent } from "./AppClass";

type Getter<T> = () => T;
type Setter<T> = (t: T) => void;

function useState<T>(component: Component<any, any>, def?: T): [Getter<T>, Setter<T>]  {
  const hookId = (component as any).hookId = ((component as any).hookId || 0) + 1;
  const getter = () => (component.state && component.state[`hook-${hookId}`]) || def;
  const setter = (v: T) => component.setState({ [`hook-${hookId}`]: v });
  return [getter, setter];
}

function useEffect(component: HookableComponent, effect: () => void): void {
  component.effects.push(effect);
}

export function useFriendStatus(component: HookableComponent, friendID: string): Getter<string> {
  const [isOnline, setIsOnline] = useState(component, 'offline');

  function handleStatusChange(status: string) {
    setIsOnline(status);
  }

  useEffect(component, () => {
    console.log('Subscribing');
    const timer = setInterval(() => {
      handleStatusChange(`${friendID} ${new Date().getTime().toString()}`);
    }, 1000);

    return () => {
      console.log('Unsubscribing');
      clearInterval(timer);
    };
  });

  return isOnline;
}