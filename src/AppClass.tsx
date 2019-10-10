import React, { Component } from "react";
import "./App.css";
import { useFriendStatus } from "./friendStatusClassHook";

export class AppClass extends Component {
  private isOnline = useFriendStatus(this, "id123");

  public render() {
    return (
      <div className="App">
        <header className="App-header">{this.isOnline.get()}</header>
      </div>
    );
  }
}
