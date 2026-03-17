import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types';
import { CLASS_COLORS } from './PixelCharacter';
import Portrait from './Portrait';

interface Props {
  task: Task;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const XP_COLORS: Record<number, string> = {
  25: '#6b5ca5',
  50: '#4488ff',
  100: '#ff8c00',
  200: '#ff3333',
};

export default function QuestItem({ task, onComplete, onDelete }: Props) {
  const [completing, setCompleting] = useState(false);
  const memberColor = CLASS_COLORS[task.user_sprite] ?? '#6b5ca5';

  async function handleComplete() {
    if (completing || task.completed) return;
    setCompleting(true);
    await onComplete(task.id);
    setCompleting(false);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: task.completed ? 0.5 : 1, x: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="pixel-window p-3 flex items-center gap-3"
      style={task.completed ? { filter: 'grayscale(0.5)' } : {}}
    >
      {/* Hero portrait */}
      <Portrait charId={task.user_sprite} size={0.75} />

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={!!task.completed || completing}
        className="flex-shrink-0"
        style={{
          width: 24, height: 24,
          border: `2px solid ${task.completed ? '#00cc44' : '#6b5ca5'}`,
          background: task.completed ? '#004400' : '#0a0820',
          color: '#00cc44',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem',
          cursor: task.completed ? 'default' : 'pointer',
          transition: 'all 0.1s',
        }}
      >
        {task.completed ? '✓' : completing ? '…' : ''}
      </button>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <div style={{
          color: task.completed ? '#4a3f8c' : '#e8d5a3',
          fontSize: '0.55rem',
          textDecoration: task.completed ? 'line-through' : 'none',
          lineHeight: 1.6,
          wordBreak: 'break-word',
        }}>
          {task.title}
        </div>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span style={{ fontSize: '0.9rem' }}>{task.skill_icon}</span>
          <span style={{ color: '#6b5ca5', fontSize: '0.45rem' }}>{task.skill_name}</span>
          <span style={{
            color: XP_COLORS[task.xp_reward] ?? '#6b5ca5',
            fontSize: '0.45rem',
            border: `1px solid ${XP_COLORS[task.xp_reward] ?? '#6b5ca5'}`,
            padding: '1px 4px',
          }}>
            +{task.xp_reward}XP
          </span>
        </div>
      </div>

      {/* Delete */}
      {!task.completed && (
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0"
          style={{
            background: 'transparent', border: 'none',
            color: '#4a3f8c', cursor: 'pointer',
            fontSize: '0.6rem', padding: '2px 4px',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ff3333')}
          onMouseLeave={e => (e.currentTarget.style.color = '#4a3f8c')}
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}
