import { useState } from 'react';
import { motion } from 'framer-motion';
import { createSkill } from '../api';

interface Props {
  userId: number;
  onClose: () => void;
  onCreated: () => void;
}

const PRESET_ICONS = ['⚔️','🧹','👕','💪','🍳','📚','🎮','🎨','🌿','🐕','💻','🚴','🏊','🧘','🛠️','💰'];
const PRESET_COLORS = ['#4488ff','#aa44ff','#ff6b35','#ffcc00','#00cc88','#ff4488','#44ffcc','#ff8844'];

export default function AddSkillModal({ userId, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('⚔️');
  const [color, setColor] = useState('#4488ff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createSkill({ name: name.trim(), icon, color, user_id: userId });
      onCreated();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="pixel-window-gold p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ color: '#ffd700', fontSize: '0.65rem', marginBottom: '1.5rem' }}>✦ NEW SKILL</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ color: '#6b5ca5', fontSize: '0.5rem', display: 'block', marginBottom: 6 }}>SKILL NAME</label>
            <input
              className="pixel-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Gardening..."
              autoFocus
              maxLength={30}
            />
          </div>

          <div>
            <label style={{ color: '#6b5ca5', fontSize: '0.5rem', display: 'block', marginBottom: 6 }}>ICON</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map(i => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIcon(i)}
                  style={{
                    background: icon === i ? '#2d1b69' : '#0a0820',
                    border: `2px solid ${icon === i ? '#ffd700' : '#4a3f8c'}`,
                    fontSize: '1.2rem', padding: '4px 6px', cursor: 'pointer', transition: 'all 0.1s',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color: '#6b5ca5', fontSize: '0.5rem', display: 'block', marginBottom: 6 }}>COLOR</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    background: c, width: 28, height: 28,
                    border: `3px solid ${color === c ? '#ffd700' : '#000'}`, cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="pixel-window p-2 flex items-center gap-2" style={{ borderColor: color }}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ color: '#e8d5a3', fontSize: '0.55rem' }}>{name || 'Preview'}</span>
            <div className="level-badge ml-auto">LV 1</div>
          </div>

          {error && <div style={{ color: '#ff3333', fontSize: '0.5rem' }}>⚠ {error}</div>}

          <div className="flex gap-3 mt-2">
            <button type="button" className="pixel-btn pixel-btn-red flex-1" onClick={onClose}>CANCEL</button>
            <button type="submit" className="pixel-btn pixel-btn-green flex-1" disabled={loading || !name.trim()}>
              {loading ? '...' : 'CREATE'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
