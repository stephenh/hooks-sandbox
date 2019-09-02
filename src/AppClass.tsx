import React from 'react';
import './App.css';
import { useFriendStatus } from "./friendStatusClassHook";
import { HookableComponent } from "./HookableComponent";

export class AppClass extends HookableComponent {
  private isOnline = useFriendStatus(this, "id123");

  public render() {
    return <div className="App">
      <header className="App-header">
        {this.isOnline()}
      </header>
    </div>
  }
}
