import { Component } from "react";
import { State, newEffect, newState } from "./classHooks";

export function useFriendStatus(
  component: Component,
  friendID: string
): State<string> {
  const online = newState(component, "offline");

  function handleStatusChange(status: string) {
    online.set(status);
  }

  newEffect(component, () => {
    console.log("Subscribing");
    const timer = setInterval(() => {
      handleStatusChange(`${friendID} ${new Date().getTime().toString()}`);
    }, 1000);

    return () => {
      console.log("Unsubscribing");
      clearInterval(timer);
    };
  });

  return online;
}
