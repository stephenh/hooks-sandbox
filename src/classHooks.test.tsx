import React, { Component, ReactElement } from "react";
import { mount } from "enzyme";
import { getContext, newEffect, newState } from "./classHooks";

describe("hooks", () => {
  describe("getContext", () => {
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

  describe("newState", () => {
    it("works", async () => {
      const c = mount(<StateTest />);
      // FIXME: Property 'toIncludeText' does not exist on type
      // 'Matchers<ReactWrapper<any, Readonly<{}>, Component<{}, {}, any>>>'
      //expect(c).toIncludeText("initial");
      expect(c.text()).toMatch("initial");
      c.simulate("click");
      //expect(c).toIncludeText("clicked");
      expect(c.text()).toMatch("clicked");
    });
  });

  describe("newEffect", () => {
    it("works", async () => {
      const c = new EffectTest({});
      expect(EffectTest.effected).toEqual(0);

      c.componentDidMount!();
      expect(c.count).toEqual(1);
      expect(EffectTest.effected).toEqual(1);

      c.componentDidUpdate!();
      expect(c.count).toEqual(2);
      expect(EffectTest.effected).toEqual(2);
    });
  });
});

export class EffectTest extends Component {
  static effected = 0;
  count = 0;

  constructor(props: object) {
    super(props);
    newEffect(this, () => EffectTest.effected++);
  }

  componentDidMount() {
    this.count++;
  }

  componentDidUpdate() {
    this.count++;
  }
}

export class StateTest extends Component {
  private value = newState(this, "initial");

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
  private my = getContext(MyContext);

  public render() {
    return <div>{this.my.name}</div>;
  }
}
