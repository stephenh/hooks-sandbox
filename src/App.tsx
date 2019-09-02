import React from 'react';
import './App.css';
import { useFriendStatus } from "./friendStatusHook";

function App() {
  const isOnline = useFriendStatus("id123");

  return (
    <div className="App">
      <header className="App-header">
        {isOnline}
      </header>
    </div>
  );
}

export default App;
