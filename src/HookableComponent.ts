import React from "react";

/**
 * A proof of concept for what hooks in a class looks like.
 *
 * AFAICT hooks allow two things:
 *
 * 1) Assigning "chunks" of the component's state to various bits of logic; we
 * represent that as a `hook-<id>` key in the state. This is buggy b/c its not
 * fully isolated from subclass's state but proof of concept.
 *
 * 2) Adding callbacks of the component's lifecycle to various bits of logic;
 * we represent this as a list of lambdas to call for each lifecycle stage.
 */
export class HookableComponent<P = {}, S = {}> extends React.Component<P, S> {

  private nextHookId = 0;
  public effects: Array<Function> = [];
  private lastEffects: Array<Function> = [];

  constructor(props: any) {
    super(props);
    // Subclasses doing `this.state = {}` will break this...
    this.state = {} as any;
  }

  public componentDidMount(): void {
    this.cancelAndRunEffects();
  }

  public componentDidUpdate(): void {
    this.cancelAndRunEffects();
  }

  private cancelAndRunEffects(): void {
    this.lastEffects.forEach(e => e());
    this.lastEffects = this.effects.map(e => e()).filter(e => e instanceof Function);
  }

  public newHookId(): number {
    return ++this.nextHookId;
  }
}
