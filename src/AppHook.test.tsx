import React from 'react';
import ReactDOM from 'react-dom';
import AppHook from './AppHook';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppHook />, div);
  ReactDOM.unmountComponentAtNode(div);
});
