import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createParty, lookupParty } from '../api';

interface Props {
  onJoined: () => void;
}

type Screen = 'home' | 'forge' | 'join' | 'created';

export default function GatherParty({ onJoined }: Props) {
  const [screen, setScreen] = useState<Screen>('home');
  const [partyName, setPartyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [createdCode, setCreatedCode] = useState('');
  const [createdName, setCreatedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleForge(e: React.FormEvent) {
    e.preventDefault();
    if (!partyName.trim()) return;
    setLoading(true); setError('');
    try {
      const party = await createParty(partyName.trim());
      localStorage.setItem('partyCode', party.code);
      localStorage.setItem('partyName', party.name);
      setCreatedCode(party.code);
      setCreatedName(party.name);
      setScreen('created');
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    setLoading(true); setError('');
    try {
      const party = await lookupParty(code);
      localStorage.setItem('partyCode', party.code);
      localStorage.setItem('partyName', party.name);
      onJoined();
    } catch (e: any) {
      setError('Party not found. Check the code and try again.');
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: '#0a0618',
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, #1a0a4e44 0%, transparent 60%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)
        `,
        fontFamily: '"Press Start 2P"',
      }}
    >
      <AnimatePresence mode="wait">

        {/* ── Home ── */}
        {screen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
            style={{ maxWidth: 420, width: '100%' }}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <div style={{
                fontSize: '0.5rem', color: '#4a3f8c',
                letterSpacing: '0.2em', marginBottom: '1rem',
              }}>
                ⚔ &nbsp; DUNGEON CLEANER &nbsp; ⚔
              </div>
              <h1 style={{
                background: 'linear-gradient(180deg, #ffe44d 0%, #ffd700 40%, #cc8800 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.1rem',
                lineHeight: 1.5,
                letterSpacing: '0.05em',
                margin: 0,
              }}>
                GATHER YOUR<br />PARTY
              </h1>
              <div style={{ color: '#2d1b69', fontSize: '0.4rem', marginTop: '1rem', letterSpacing: '0.1em' }}>
                FORGE A NEW PARTY OR JOIN AN EXISTING ONE
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 w-full"
            >
              <button
                className="pixel-btn pixel-btn-primary"
                style={{ fontSize: '0.6rem', padding: '14px', textAlign: 'center' }}
                onClick={() => setScreen('forge')}
              >
                ⚔ &nbsp; FORGE A NEW PARTY
              </button>
              <button
                className="pixel-btn"
                style={{
                  fontSize: '0.6rem', padding: '14px', textAlign: 'center',
                  background: '#0a0820', border: '2px solid #4a3f8c', color: '#6b5ca5',
                  boxShadow: '3px 3px 0 #000',
                }}
                onClick={() => setScreen('join')}
              >
                ✦ &nbsp; JOIN A PARTY
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              style={{ color: '#1a1040', fontSize: '0.35rem', marginTop: '3rem' }}
            >
              © DUNGEON CLEANER · ALL ADVENTURERS WELCOME
            </motion.div>
          </motion.div>
        )}

        {/* ── Forge ── */}
        {screen === 'forge' && (
          <motion.div
            key="forge"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="pixel-window-gold p-6 w-full"
            style={{ maxWidth: 400 }}
          >
            <div style={{ color: '#ffd700', fontSize: '0.65rem', marginBottom: '0.5rem' }}>⚔ FORGE A NEW PARTY</div>
            <div style={{ color: '#4a3f8c', fontSize: '0.4rem', marginBottom: '1.5rem', lineHeight: 2 }}>
              NAME YOUR PARTY — YOUR COMPANIONS WILL JOIN USING THE CODE YOU RECEIVE
            </div>
            <form onSubmit={handleForge} className="flex flex-col gap-4">
              <div>
                <label style={{ color: '#6b5ca5', fontSize: '0.48rem', display: 'block', marginBottom: 6 }}>PARTY NAME</label>
                <input
                  className="pixel-input"
                  value={partyName}
                  onChange={e => setPartyName(e.target.value)}
                  placeholder="e.g. House Evans..."
                  autoFocus
                  maxLength={30}
                />
              </div>
              {error && <div style={{ color: '#ff3333', fontSize: '0.45rem' }}>⚠ {error}</div>}
              <div className="flex gap-3 mt-2">
                <button type="button" className="pixel-btn pixel-btn-red flex-1" onClick={() => { setScreen('home'); setError(''); }}>
                  ◄ BACK
                </button>
                <button type="submit" className="pixel-btn pixel-btn-green flex-1" disabled={loading || !partyName.trim()}>
                  {loading ? '...' : 'FORGE ►'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Join ── */}
        {screen === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="pixel-window-gold p-6 w-full"
            style={{ maxWidth: 400 }}
          >
            <div style={{ color: '#ffd700', fontSize: '0.65rem', marginBottom: '0.5rem' }}>✦ JOIN A PARTY</div>
            <div style={{ color: '#4a3f8c', fontSize: '0.4rem', marginBottom: '1.5rem', lineHeight: 2 }}>
              ENTER THE PARTY CODE SHARED BY YOUR COMPANION
            </div>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div>
                <label style={{ color: '#6b5ca5', fontSize: '0.48rem', display: 'block', marginBottom: 6 }}>PARTY CODE</label>
                <input
                  className="pixel-input"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCD-1234"
                  autoFocus
                  maxLength={9}
                  style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}
                />
              </div>
              {error && <div style={{ color: '#ff3333', fontSize: '0.45rem' }}>⚠ {error}</div>}
              <div className="flex gap-3 mt-2">
                <button type="button" className="pixel-btn pixel-btn-red flex-1" onClick={() => { setScreen('home'); setError(''); }}>
                  ◄ BACK
                </button>
                <button type="submit" className="pixel-btn pixel-btn-green flex-1" disabled={loading || !joinCode.trim()}>
                  {loading ? '...' : 'JOIN ►'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Party created ── */}
        {screen === 'created' && (
          <motion.div
            key="created"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pixel-window-gold p-6 w-full flex flex-col items-center"
            style={{ maxWidth: 400, textAlign: 'center' }}
          >
            <div style={{ color: '#ffd700', fontSize: '0.65rem', marginBottom: '0.5rem' }}>✦ PARTY FORGED!</div>
            <div style={{ color: '#e8d5a3', fontSize: '0.55rem', marginBottom: '1.5rem' }}>{createdName}</div>

            <div style={{ color: '#6b5ca5', fontSize: '0.42rem', marginBottom: '0.75rem' }}>YOUR PARTY CODE</div>
            <div style={{
              background: '#050310',
              border: '2px solid #ffd700',
              padding: '1rem 1.5rem',
              marginBottom: '1rem',
              letterSpacing: '0.2em',
              color: '#ffd700',
              fontSize: '1.1rem',
            }}>
              {createdCode}
            </div>
            <div style={{ color: '#4a3f8c', fontSize: '0.38rem', lineHeight: 2, marginBottom: '1.5rem' }}>
              SHARE THIS CODE WITH YOUR COMPANIONS<br />
              SO THEY CAN JOIN YOUR PARTY
            </div>
            <button className="pixel-btn pixel-btn-green w-full" style={{ fontSize: '0.55rem' }} onClick={onJoined}>
              BEGIN ADVENTURE ►
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
