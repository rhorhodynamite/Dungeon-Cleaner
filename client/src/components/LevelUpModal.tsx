import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CompleteTaskResult } from '../types';
import PixelCharacter from './PixelCharacter';

interface Props {
  result: CompleteTaskResult | null;
  onClose: () => void;
  spriteId?: string;
}

const SPARKLES = ['✨', '⭐', '🌟', '💫', '★', '✦'];

function Sparkle({ delay, x, y }: { delay: number; x: number; y: number }) {
  const symbol = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
  return (
    <motion.span
      initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      animate={{ opacity: 0, y: -80 + y, x: x, scale: 1.5 }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        fontSize: '1.4rem',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {symbol}
    </motion.span>
  );
}

export default function LevelUpModal({ result, onClose, spriteId }: Props) {
  const [animKey, setAnimKey] = useState(0);
  const [sparkles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.08,
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 60,
    }))
  );
  const [showLevel, setShowLevel] = useState(false);

  useEffect(() => {
    if (!result) return;
    setShowLevel(false);
    setAnimKey(k => k + 1);
    const t = setTimeout(() => setShowLevel(true), 400);
    return () => clearTimeout(t);
  }, [result]);

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [result, onClose]);

  return (
    <AnimatePresence>
      {result?.leveledUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={onClose}
        >
          {/* Scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          <motion.div
            initial={{ scale: 0.3, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="pixel-window-gold p-8 text-center relative"
            style={{ minWidth: 320, maxWidth: 420 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sparkles */}
            {sparkles.map(s => (
              <Sparkle key={s.id} delay={s.delay} x={s.x} y={s.y} />
            ))}

            {/* Header flash */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'linear-gradient(90deg, #aa8800, #ffd700, #ffe44d, #ffd700, #aa8800)',
                backgroundSize: '200% auto',
                animation: 'shimmer 1.5s linear infinite',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1rem',
                marginBottom: '1rem',
                letterSpacing: '0.1em',
              }}
            >
              LEVEL UP!
            </motion.div>

            {/* Character sprite doing levelUp animation */}
            {spriteId && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <PixelCharacter
                  charId={spriteId}
                  size={1.4}
                  animation="levelUp"
                  animKey={animKey}
                />
              </div>
            )}

            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {result.skillIcon}
            </div>

            <div style={{ color: '#e8d5a3', fontSize: '0.6rem', marginBottom: '1rem' }}>
              {result.skillName}
            </div>

            <AnimatePresence>
              {showLevel && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  style={{ color: '#ffd700', fontSize: '2.5rem', fontFamily: '"Press Start 2P"' }}
                >
                  LV {result.newLevel}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ color: '#00cc44', fontSize: '0.5rem', marginTop: '1rem' }}
            >
              +{result.xpGained} XP gained!
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ color: '#6b5ca5', fontSize: '0.45rem', marginTop: '1.5rem' }}
              className="animate-blink"
            >
              ▶ PRESS ANY KEY
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
