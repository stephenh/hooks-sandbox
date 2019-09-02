import React from 'react';
import './App.css';
import { useFriendStatus } from "./friendStatusClassHook";


export class HookableComponent<P = {}, S = {}> extends React.Component<P, S> {
  private nextHookId = 0;
  public effects: Array<Function> = [];

  constructor(props: any) {
    super(props);
    // Subclasses doing `this.state = {}` will break this...
    this.state = {} as any;
  }

  public componentDidMount(): void {
    this.effects.forEach(e => e());
  }

  public newHookId(): number {
    return ++this.nextHookId;
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
