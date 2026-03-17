import { motion } from 'framer-motion';
import type { Skill } from '../types';
import XPBar from './XPBar';

function getLevelTitle(level: number): string {
  if (level < 3) return 'Peasant';
  if (level < 5) return 'Squire';
  if (level < 8) return 'Adventurer';
  if (level < 12) return 'Knight';
  if (level < 20) return 'Champion';
  if (level < 35) return 'Hero';
  if (level < 50) return 'Legend';
  return 'Grandmaster';
}

interface Props {
  skill: Skill;
  onDelete?: (id: number) => void;
  highlight?: boolean;
}

export default function SkillCard({ skill, onDelete, highlight }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: highlight
          ? ['6px 6px 0 5px #000', '6px 6px 0 5px #ffd700', '6px 6px 0 5px #000']
          : '6px 6px 0 5px #000',
      }}
      transition={{ duration: 0.3 }}
      className="pixel-window p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.6rem' }}>{skill.icon}</span>
          <div>
            <div style={{ color: '#e8d5a3', fontSize: '0.6rem', marginBottom: '4px' }}>
              {skill.name}
            </div>
            <div style={{ color: '#6b5ca5', fontSize: '0.45rem' }}>
              {getLevelTitle(skill.level)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="level-badge">LV {skill.level}</div>
          {onDelete && (
            <button
              onClick={() => onDelete(skill.id)}
              className="pixel-btn pixel-btn-red"
              style={{ padding: '4px 6px', fontSize: '0.5rem' }}
              title="Delete skill"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* XP Bar */}
      <div>
        <XPBar
          xp={skill.xp}
          xpToNextLevel={skill.xpToNextLevel}
          color={skill.color}
          showLabel
        />
      </div>

      {/* Color accent line */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${skill.color}, transparent)`,
          marginTop: -4,
        }}
      />
    </motion.div>
  );
}
