import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../types';
import { fetchUsers, deleteUser } from '../api';
import PixelCharacter, { PixelPortrait, CHARACTERS, CLASS_COLORS } from './PixelCharacter';
import CreateCharacterModal from './CreateCharacterModal';

interface Props {
  onSelect: (user: User) => void;
}

const MAX_SLOTS = 6;

function getLevelTitle(total: number): string {
  if (total <= 4)  return 'Newcomer';
  if (total <= 10) return 'Apprentice';
  if (total <= 20) return 'Adventurer';
  if (total <= 40) return 'Hero';
  if (total <= 70) return 'Champion';
  return 'Legend';
}

function getCharColor(spriteId: string): string {
  return CLASS_COLORS[spriteId] ?? '#6b5ca5';
}

export default function CharacterSelect({ onSelect }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const reload = useCallback(async () => {
    const u = await fetchUsers();
    setUsers(u);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    const totalSlots = Math.min(users.length + 1, MAX_SLOTS);
    function onKey(e: KeyboardEvent) {
      if (showCreate || confirmDelete !== null) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => (c + 1) % totalSlots); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => (c - 1 + totalSlots) % totalSlots); }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (users[cursor]) triggerSelect(users[cursor]);
        else setShowCreate(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [users, cursor, showCreate, confirmDelete]);

  function triggerSelect(user: User) {
    setFlash(true);
    setTimeout(() => onSelect(user), 350);
  }

  async function handleDelete(userId: number) {
    await deleteUser(userId);
    setConfirmDelete(null);
    await reload();
    setCursor(0);
  }

  const emptySlots = Math.max(0, MAX_SLOTS - users.length - 1);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: '#0a0618',
        backgroundImage: `
          radial-gradient(ellipse at 50% 0%, #1a0a4e55 0%, transparent 60%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
        `,
      }}
    >
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1
          style={{
            background: 'linear-gradient(90deg, #aa8800, #ffd700, #ffe44d, #ffd700, #aa8800)',
            backgroundSize: '200% auto',
            animation: 'shimmer 3s linear infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1rem',
            letterSpacing: '0.15em',
            margin: 0,
            marginBottom: '0.5rem',
          }}
        >
          ⚔  SELECT YOUR HERO  ⚔
        </h1>
        <div style={{ color: '#4a3f8c', fontSize: '0.45rem', letterSpacing: '0.1em' }}>
          USE ↑↓ TO NAVIGATE  ·  ENTER TO SELECT
        </div>
      </motion.div>

      {/* Slot list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg"
      >
        <div className="pixel-window-gold" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="p-8 text-center" style={{ color: '#4a3f8c', fontSize: '0.6rem' }}>
              <span className="animate-blink">LOADING...</span>
            </div>
          ) : (
            <>
              {users.map((user, i) => {
                const color = getCharColor(user.sprite);
                const isSelected = cursor === i;
                return (
                  <motion.div
                    key={user.id}
                    style={{
                      borderBottom: '2px solid #2d1b69',
                      background: isSelected ? '#2d1b69' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onClick={() => { setCursor(i); triggerSelect(user); }}
                    onMouseEnter={() => setCursor(i)}
                  >
                    <div className="flex items-center gap-3 px-4 py-2">
                      {/* Cursor */}
                      <div style={{ width: 16, flexShrink: 0, color: '#ffd700', fontSize: '0.7rem', textAlign: 'center' }}>
                        {isSelected && (
                          <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>►</motion.span>
                        )}
                      </div>

                      {/* Portrait */}
                      <div style={{ flexShrink: 0 }}>
                        <PixelPortrait charId={user.sprite} size={1.6} selected={isSelected} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div style={{ color: isSelected ? '#ffd700' : '#e8d5a3', fontSize: '0.62rem', marginBottom: 4 }}>
                          {user.name}
                        </div>
                        <div style={{ color: color, fontSize: '0.42rem', marginBottom: 4 }}>
                          {CHARACTERS.find(c => c.id === user.sprite)?.label ?? 'Hero'}
                        </div>
                        <div style={{ color: '#4a3f8c', fontSize: '0.38rem' }}>
                          {getLevelTitle(user.totalLevel)} · {user.questsDone} QUESTS
                        </div>
                      </div>

                      {/* Total level */}
                      <div className="text-right flex-shrink-0">
                        <div style={{ color: '#ffd700', fontSize: '1.1rem', lineHeight: 1 }}>{user.totalLevel}</div>
                        <div style={{ color: '#4a3f8c', fontSize: '0.38rem', marginTop: 2 }}>TOTAL LV</div>
                      </div>

                      {/* Delete */}
                      {isSelected && (
                        <button
                          onClick={e => { e.stopPropagation(); setConfirmDelete(user.id); }}
                          style={{
                            background: 'transparent', border: '1px solid #4a3f8c',
                            color: '#4a3f8c', fontSize: '0.45rem', padding: '3px 5px',
                            cursor: 'pointer', fontFamily: '"Press Start 2P"', flexShrink: 0,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#ff3333'; e.currentTarget.style.borderColor = '#ff3333'; }}
                          onMouseLeave={e => { e.currentTarget.style.color = '#4a3f8c'; e.currentTarget.style.borderColor = '#4a3f8c'; }}
                        >
                          DEL
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* New Game slot */}
              {users.length < MAX_SLOTS && (() => {
                const i = users.length;
                const isSelected = cursor === i;
                return (
                  <motion.div
                    style={{
                      borderBottom: emptySlots > 0 ? '2px solid #2d1b69' : 'none',
                      background: isSelected ? '#1a1040' : 'transparent',
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                    onClick={() => { setCursor(i); setShowCreate(true); }}
                    onMouseEnter={() => setCursor(i)}
                  >
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div style={{ width: 16, color: '#ffd700', fontSize: '0.7rem', textAlign: 'center' }}>
                        {isSelected && <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>►</motion.span>}
                      </div>
                      <div style={{
                        width: 77, height: 86, border: '2px dashed #2d1b69',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.6rem', color: isSelected ? '#6b5ca5' : '#2d1b69', flexShrink: 0,
                      }}>+</div>
                      <div>
                        <div style={{ color: isSelected ? '#ffd700' : '#4a3f8c', fontSize: '0.55rem' }}>NEW GAME</div>
                        <div style={{ color: '#2d1b69', fontSize: '0.38rem', marginTop: 4 }}>CREATE A NEW HERO</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Empty slots */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <div key={i} style={{
                  borderBottom: i < emptySlots - 1 ? '2px solid #1a1040' : 'none',
                  padding: '0.5rem 1rem 0.5rem 3.5rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                }}>
                  <div style={{ width: 52, height: 88, border: '1px solid #1a1040', flexShrink: 0 }} />
                  <div style={{ color: '#1a1040', fontSize: '0.45rem' }}>— EMPTY —</div>
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        style={{ color: '#2d1b69', fontSize: '0.38rem', marginTop: '2rem', letterSpacing: '0.08em' }}
      >
        © QUEST LOG RPG  ·  ALL ADVENTURERS WELCOME
      </motion.div>

      <AnimatePresence>
        {showCreate && (
          <CreateCharacterModal
            onClose={() => setShowCreate(false)}
            onCreated={user => { reload(); setShowCreate(false); triggerSelect(user); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)' }}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="pixel-window p-6 text-center" style={{ maxWidth: 320 }}
            >
              <div style={{ color: '#ff3333', fontSize: '0.65rem', marginBottom: '1rem' }}>⚠ DELETE HERO?</div>
              <div style={{ color: '#6b5ca5', fontSize: '0.5rem', marginBottom: '1.5rem', lineHeight: 2 }}>
                ALL SKILLS AND QUESTS<br />WILL BE LOST FOREVER.
              </div>
              <div className="flex gap-3">
                <button className="pixel-btn pixel-btn-primary flex-1" onClick={() => setConfirmDelete(null)}>CANCEL</button>
                <button className="pixel-btn pixel-btn-red flex-1" onClick={() => handleDelete(confirmDelete!)}>DELETE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
