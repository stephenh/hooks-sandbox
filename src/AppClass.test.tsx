import React from 'react';
import ReactDOM from 'react-dom';
import { AppClass } from "./AppClass";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppClass />, div);
  ReactDOM.unmountComponentAtNode(div);
});
