import React, { useEffect } from 'react';
import Connected from './features/components/Connected';
import Options from './features/components/Options';
import './App.css';
import { w3cwebsocket } from 'websocket';

const client = new w3cwebsocket('ws://127.0.0.1:8000');

function App() {
  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      // TODO: change state accordingly
      console.log(message);
    };
    client.onerror = function() {
      console.log('Connection Error');
  };
  }, []);

  return (
    <div className="App">
      <Connected />
      <Options />
    </div>
  );
}

export default App;
