import { HookableComponent } from "./HookableComponent";
import { State, useEffect, useState } from "./hooks";

export function useFriendStatus(component: HookableComponent, friendID: string): State<string> {
  const online = useState(component, 'offline');

  function handleStatusChange(status: string) {
    online.set(status);
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

  return online;
}