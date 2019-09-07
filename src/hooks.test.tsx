import { useContext, useState } from "./hooks";
import React, { Component, ReactElement } from "react";
import { mount } from "enzyme";
import { HookableComponent } from "./HookableComponent";

describe("hooks", () => {
  describe("useContext", () => {
    it("works", () => {
      const foo = mount(<Foo />);
      expect(foo).toMatchInlineSnapshot(`
        <Foo>
          <div>
            fred
          </div>
        </Foo>
      `);
    });
  });

  describe("useState", () => {
    it("works", async () => {
      const c = mount(<StateTest />);
      expect(c).toIncludeText("initial");
      c.simulate('click');
      expect(c).toIncludeText("clicked");
    });
  });
});

export class StateTest extends Component {
  private value = useState(this, "initial");

  public render(): ReactElement {
    return <button onClick={this.onClick}>{this.value.get()}</button>;
  }

  private onClick = () => {
    this.value.set("clicked");
  };
}

type My = { name: string };
const MyContext = React.createContext<My>({ name: "fred" });

export class Foo extends Component {
  private my = useContext(MyContext);

  public render() {
    return <div>{this.my.name}</div>;
  }
}
