import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../types';
import PixelCharacter, { CHARACTERS, CLASS_COLORS } from './PixelCharacter';
import Portrait from './Portrait';
import { createUser } from '../api';

const TOTAL = CHARACTERS.length;

interface Props {
  onClose: () => void;
  onCreated: (user: User) => void;
}

export default function CreateCharacterModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const [step, setStep] = useState<'name' | 'class'>('name');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedChar = CHARACTERS[charIndex];
  const color = CLASS_COLORS[selectedChar.id] ?? '#6b5ca5';

  function prev() { setSlideDir(-1); setCharIndex(i => (i - 1 + TOTAL) % TOTAL); }
  function next() { setSlideDir(1);  setCharIndex(i => (i + 1) % TOTAL); }

  // Preload all portrait images when step 2 opens so carousel is instant
  useEffect(() => {
    if (step !== 'class') return;
    CHARACTERS.forEach(c => { new Image().src = `/portraits/${c.id}.png`; });
  }, [step]);

  // Keyboard navigation on step 2
  useEffect(() => {
    if (step !== 'class') return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, charIndex]);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const user = await createUser({
        name: name.trim(),
        sprite: selectedChar.id,
        color: CLASS_COLORS[selectedChar.id] ?? '#6b5ca5',
      });
      onCreated(user);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.92)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="pixel-window-gold w-full"
        style={{ maxWidth: 400 }}
      >
        {/* Title bar */}
        <div style={{
          borderBottom: '2px solid #aa8800', padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <motion.span
            style={{ color: '#ffd700', fontSize: '0.6rem' }}
          >
            {step === 'name' ? '✦ ENTER YOUR NAME' : '✦ CHOOSE YOUR CLASS'}
          </motion.span>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#4a3f8c',
            cursor: 'pointer', fontSize: '0.7rem', fontFamily: '"Press Start 2P"',
          }}>✕</button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <AnimatePresence mode="wait">

            {/* ── Step 1: name ── */}
            {step === 'name' && (
              <motion.div key="name" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ color: '#6b5ca5', fontSize: '0.5rem', marginBottom: '0.75rem' }}>HERO NAME</div>
                <input
                  className="pixel-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setStep('class'); }}
                  placeholder="Enter your name..."
                  autoFocus
                  maxLength={20}
                />
                <div style={{ color: '#2d1b69', fontSize: '0.4rem', marginTop: '0.5rem' }}>
                  PRESS ENTER OR CLICK NEXT
                </div>
                {error && <div style={{ color: '#ff3333', fontSize: '0.5rem', marginTop: '0.75rem' }}>⚠ {error}</div>}
                <div className="flex gap-3 mt-6">
                  <button className="pixel-btn pixel-btn-red flex-1" onClick={onClose}>CANCEL</button>
                  <button className="pixel-btn pixel-btn-primary flex-1" disabled={!name.trim()} onClick={() => setStep('class')}>
                    NEXT ►
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: carousel ── */}
            {step === 'class' && (
              <motion.div key="class" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>

                {/* Glowing backdrop that shifts with class colour */}
                <motion.div
                  animate={{ background: `radial-gradient(ellipse at 50% 60%, ${color}28 0%, transparent 70%)` }}
                  transition={{ duration: 0.4 }}
                  style={{ borderRadius: 2, marginBottom: '0.5rem', padding: '0.5rem 0 0' }}
                >
                  {/* Portrait + arrows row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

                    {/* Prev arrow */}
                    <motion.button
                      type="button"
                      onClick={prev}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.88 }}
                      animate={{ borderColor: `${color}88`, color }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: '#0a0618',
                        border: `2px solid ${color}88`,
                        color,
                        fontSize: '0.7rem',
                        width: 38, height: 38,
                        cursor: 'pointer', flexShrink: 0,
                        fontFamily: '"Press Start 2P"',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >◄</motion.button>

                    {/* Draggable portrait stage */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -40) next();
                        else if (info.offset.x > 40) prev();
                      }}
                      style={{ flex: 1, overflow: 'visible', cursor: 'grab', padding: '8px 0' }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={selectedChar.id}
                          initial={{ opacity: 0, x: slideDir * 70, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: slideDir * -70, scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Portrait
                            charId={selectedChar.id}
                            size={2.2}
                            fallback={
                              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%', paddingBottom: 8 }}>
                                <PixelCharacter charId={selectedChar.id} size={1.8} animation="idle" />
                              </div>
                            }
                          />
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>

                    {/* Next arrow */}
                    <motion.button
                      type="button"
                      onClick={next}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.88 }}
                      animate={{ borderColor: `${color}88`, color }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: '#0a0618',
                        border: `2px solid ${color}88`,
                        color,
                        fontSize: '0.7rem',
                        width: 38, height: 38,
                        cursor: 'pointer', flexShrink: 0,
                        fontFamily: '"Press Start 2P"',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >►</motion.button>
                  </div>
                </motion.div>

                {/* Class name — animates separately */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedChar.id + '-label'}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    style={{ textAlign: 'center', margin: '0.6rem 0 0.5rem' }}
                  >
                    <motion.div
                      animate={{ color }}
                      transition={{ duration: 0.3 }}
                      style={{ fontSize: '0.65rem', marginBottom: 4, fontFamily: '"Press Start 2P"' }}
                    >
                      {selectedChar.label}
                    </motion.div>
                    <div style={{ color: '#a090c0', fontSize: '0.45rem' }}>{name}</div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: '1.25rem' }}>
                  {CHARACTERS.map((c, i) => (
                    <motion.button
                      key={i}
                      type="button"
                      onClick={() => { setSlideDir(i > charIndex ? 1 : -1); setCharIndex(i); }}
                      animate={{
                        width: i === charIndex ? 14 : 6,
                        background: i === charIndex ? color : '#2d1b69',
                        opacity: i === charIndex ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        height: 5, border: 'none',
                        cursor: 'pointer', padding: 0,
                        borderRadius: 0,
                      }}
                      title={c.label}
                    />
                  ))}
                </div>

                {error && <div style={{ color: '#ff3333', fontSize: '0.5rem', marginBottom: '0.75rem' }}>⚠ {error}</div>}

                <div className="flex gap-3">
                  <button className="pixel-btn pixel-btn-primary flex-1" onClick={() => setStep('name')}>◄ BACK</button>
                  <button className="pixel-btn pixel-btn-green flex-1" onClick={handleCreate} disabled={loading}>
                    {loading ? '...' : 'START! ►'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
