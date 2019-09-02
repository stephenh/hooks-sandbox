import { HookableComponent } from "./HookableComponent";

type Getter<T> = () => T;
type Setter<T> = (t: T) => void;

function useState<T>(component: HookableComponent, def?: T): [Getter<T>, Setter<T>]  {
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