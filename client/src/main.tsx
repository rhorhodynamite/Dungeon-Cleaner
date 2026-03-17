import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GatherParty from './components/GatherParty';
import './index.css';

function Root() {
  const [partyCode, setPartyCode] = useState<string | null>(localStorage.getItem('partyCode'));

  function handleJoined() {
    setPartyCode(localStorage.getItem('partyCode'));
  }

  function handleLeave() {
    localStorage.removeItem('partyCode');
    localStorage.removeItem('partyName');
    setPartyCode(null);
  }

  if (!partyCode) return <GatherParty onJoined={handleJoined} />;
  return <App onLeave={handleLeave} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
