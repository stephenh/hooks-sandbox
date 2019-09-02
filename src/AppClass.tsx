import React from 'react';
import './App.css';
import { useFriendStatus } from "./friendStatusClassHook";


export class HookableComponent<P = {}, S = {}> extends React.Component<P, S> {
  public effects: Array<Function> = [];

  public componentDidMount(): void {
    this.effects.forEach(e => e());
  }
}

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
