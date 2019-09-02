import React from 'react';
import './App.css';
import { useFriendStatus } from "./friendStatusClassHook";

export class AppClass extends React.Component {

  public effects: Array<Function> = [];
  private isOnline = useFriendStatus(this, "id123");

  public render() {
    return <div className="App">
      <header className="App-header">
        {this.isOnline()}
      </header>
    </div>
  }

  public componentDidMount(): void {
    this.effects.forEach(e => e());
  }

}
