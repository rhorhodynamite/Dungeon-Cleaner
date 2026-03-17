import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill, XpReward } from '../types';
import { XP_LABELS } from '../types';
import { createTask } from '../api';
import { getQuestSuggestion } from '../questSuggestions';
import PixelCharacter, { CLASS_COLORS } from './PixelCharacter';
import Portrait from './Portrait';

interface Props {
  skills: Skill[];
  onClose: () => void;
  onCreated: () => void;
}

const XP_OPTIONS: XpReward[] = [25, 50, 100, 200];

export default function AddQuestModal({ skills, onClose, onCreated }: Props) {
  // Unique heroes derived from skills
  const heroes = Array.from(
    new Map(skills.map(s => [s.user_id, { id: s.user_id, name: s.user_name, sprite: s.user_sprite }])).values()
  );

  const [title, setTitle] = useState('');
  const [heroId, setHeroId] = useState<number>(heroes[0]?.id ?? 0);
  const [skillId, setSkillId] = useState<number>(skills.find(s => s.user_id === heroes[0]?.id)?.id ?? 0);
  const [xpReward, setXpReward] = useState<XpReward>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const heroSkills = skills.filter(s => s.user_id === heroId);
  const selectedSkill = skills.find(s => s.id === skillId);

  function selectHero(id: number) {
    setHeroId(id);
    const first = skills.find(s => s.user_id === id);
    setSkillId(first?.id ?? 0);
  }

  function handleInspire() {
    if (!selectedSkill) return;
    setTitle(getQuestSuggestion(selectedSkill.name));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    try {
      await createTask({ title: title.trim(), skill_id: skillId, xp_reward: xpReward });
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
        <div style={{ color: '#ffd700', fontSize: '0.65rem', marginBottom: '1.5rem' }}>
          ✦ NEW QUEST
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Quest name + inspire */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ color: '#6b5ca5', fontSize: '0.5rem' }}>QUEST NAME</label>
              <button
                type="button"
                onClick={handleInspire}
                style={{
                  background: 'transparent', border: '1px solid #4a3f8c',
                  color: '#a070ff', fontSize: '0.38rem', padding: '2px 6px',
                  cursor: 'pointer', fontFamily: '"Press Start 2P"',
                }}
              >
                ✦ INSPIRE ME
              </button>
            </div>
            <input
              className="pixel-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter quest name..."
              autoFocus
              maxLength={80}
            />
          </div>

          {/* Hero picker */}
          <div>
            <label style={{ color: '#6b5ca5', fontSize: '0.5rem', display: 'block', marginBottom: 6 }}>
              ASSIGN TO HERO
            </label>
            <div className="flex gap-2 flex-wrap">
              {heroes.map(hero => {
                const color = CLASS_COLORS[hero.sprite] ?? '#6b5ca5';
                const isSelected = hero.id === heroId;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    onClick={() => selectHero(hero.id)}
                    className="flex flex-col items-center gap-1"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isSelected ? color : '#6b5ca5',
                      fontSize: '0.38rem',
                      padding: '2px',
                      cursor: 'pointer',
                      fontFamily: '"Press Start 2P"',
                    }}
                  >
                    <Portrait
                      charId={hero.sprite}
                      size={1.1}
                      selected={isSelected}
                      fallback={<PixelCharacter charId={hero.sprite} size={0.85} animation={isSelected ? 'idle' : 'static'} />}
                    />
                    <span style={{ marginTop: 3 }}>{hero.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill picker */}
          <div>
            <label style={{ color: '#6b5ca5', fontSize: '0.5rem', display: 'block', marginBottom: 6 }}>
              SKILL
            </label>
            <div className="flex gap-2 flex-wrap">
              {heroSkills.map(s => {
                const isSelected = s.id === skillId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSkillId(s.id)}
                    style={{
                      background: isSelected ? '#1a1040' : '#0a0820',
                      border: `2px solid ${isSelected ? s.color : '#4a3f8c'}`,
                      color: isSelected ? s.color : '#6b5ca5',
                      fontSize: '0.42rem',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontFamily: '"Press Start 2P"',
                      boxShadow: isSelected ? `0 0 6px ${s.color}44` : 'none',
                    }}
                  >
                    {s.icon} {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* XP difficulty */}
          <div>
            <label style={{ color: '#6b5ca5', fontSize: '0.5rem', display: 'block', marginBottom: 6 }}>
              DIFFICULTY / XP REWARD
            </label>
            <div className="grid grid-cols-4 gap-2">
              {XP_OPTIONS.map(xp => (
                <button
                  key={xp}
                  type="button"
                  onClick={() => setXpReward(xp)}
                  className="pixel-btn"
                  style={{
                    background: xpReward === xp ? '#2d1b69' : '#0a0820',
                    border: `2px solid ${xpReward === xp ? '#ffd700' : '#4a3f8c'}`,
                    color: xpReward === xp ? '#ffd700' : '#6b5ca5',
                    fontSize: '0.45rem', padding: '6px 2px', textAlign: 'center',
                  }}
                >
                  <div>{XP_LABELS[xp]}</div>
                  <div style={{ marginTop: 2, color: '#00cc44' }}>+{xp}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div style={{ color: '#ff3333', fontSize: '0.5rem' }}>⚠ {error}</div>}

          <div className="flex gap-3 mt-2">
            <button type="button" className="pixel-btn pixel-btn-red flex-1" onClick={onClose}>
              CANCEL
            </button>
            <button
              type="submit"
              className="pixel-btn pixel-btn-green flex-1"
              disabled={loading || !title.trim()}
            >
              {loading ? '...' : 'ADD QUEST'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
