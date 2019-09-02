import { useEffect, useState } from 'react';

export function useFriendStatus(friendID: string): string {
  const [isOnline, setIsOnline] = useState('offline');

  function handleStatusChange(status: string) {
    setIsOnline(status);
  }

  useEffect(() => {
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