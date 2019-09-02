import { HookableComponent } from "./HookableComponent";
import { Getter, useEffect, useState } from "./hooks";

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