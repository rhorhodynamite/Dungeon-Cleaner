import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { User, Skill, Task, CompleteTaskResult } from './types';
import { fetchUsers, fetchAllSkills, fetchTasks, completeTask } from './api';
import QuestLog from './components/QuestLog';
import SkillsScreen from './components/SkillsScreen';
import LevelUpModal from './components/LevelUpModal';
import PixelCharacter, { CLASS_COLORS } from './components/PixelCharacter';

type Tab = 'quests' | 'skills';

function FloatingXP({ xp, color }: { xp: number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -60 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: '30%', right: '2rem',
        fontFamily: '"Press Start 2P"', fontSize: '0.8rem',
        color, pointerEvents: 'none', zIndex: 100,
        textShadow: '2px 2px 0 #000',
      }}
    >
      +{xp} XP
    </motion.div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('quests');
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [levelUpResult, setLevelUpResult] = useState<{ result: CompleteTaskResult; spriteId: string } | null>(null);
  const [highlightSkillId, setHighlightSkillId] = useState<number | null>(null);
  const [floatingXP, setFloatingXP] = useState<{ id: number; xp: number; color: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [u, s, t] = await Promise.all([fetchUsers(), fetchAllSkills(), fetchTasks()]);
    setUsers(Array.isArray(u) ? u : []);
    setSkills(Array.isArray(s) ? s : []);
    setTasks(Array.isArray(t) ? t : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleComplete(taskId: number) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const result = await completeTask(taskId);
    setFloatingXP({ id: Date.now(), xp: result.xpGained, color: task.skill_color });
    setTimeout(() => setFloatingXP(null), 1600);
    await loadData();
    setHighlightSkillId(task.skill_id);
    setTimeout(() => setHighlightSkillId(null), 2000);
    if (result.leveledUp) setLevelUpResult({ result, spriteId: task.user_sprite });
  }

  const totalLevel = skills.reduce((sum, s) => sum + s.level, 0);
  const questsCompleted = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen" style={{ fontFamily: '"Press Start 2P"' }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0a0618 0%, #1a1040 100%)',
        borderBottom: '3px solid #2d1b69',
        boxShadow: '0 4px 0 #000',
      }}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            {/* Left: animated sprites */}
            <div className="flex items-end gap-2" style={{ overflowX: 'auto' }}>
              {users.map(u => {
                const color = CLASS_COLORS[u.sprite] ?? '#6b5ca5';
                return (
                  <div key={u.id} className="flex flex-col items-center gap-1" style={{ flexShrink: 0 }}>
                    <div style={{
                      width: 40, height: 92,
                      border: `2px solid ${color}`,
                      boxShadow: `0 0 6px ${color}44`,
                      background: '#0a0618',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      overflow: 'hidden', paddingBottom: 1,
                    }}>
                      <PixelCharacter charId={u.sprite} size={0.7} animation="idle" />
                    </div>
                    <div style={{ color, fontSize: '0.32rem' }}>{u.name}</div>
                  </div>
                );
              })}
              {users.length === 0 && (
                <div style={{ color: '#4a3f8c', fontSize: '0.45rem' }}>NO HEROES YET</div>
              )}
            </div>

            {/* Right: party stats */}
            <div className="flex gap-4" style={{ flexShrink: 0 }}>
              <div className="text-center">
                <div style={{ color: '#ffd700', fontSize: '0.9rem' }}>{totalLevel}</div>
                <div style={{ color: '#4a3f8c', fontSize: '0.38rem' }}>TOTAL LV</div>
              </div>
              <div className="text-center">
                <div style={{ color: '#00cc44', fontSize: '0.9rem' }}>{questsCompleted}</div>
                <div style={{ color: '#4a3f8c', fontSize: '0.38rem' }}>QUESTS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="max-w-2xl mx-auto px-4 flex mt-2">
          {(['quests', 'skills'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: '"Press Start 2P"', fontSize: '0.55rem',
                padding: '10px 20px',
                background: tab === t ? '#1a1040' : 'transparent',
                color: tab === t ? '#ffd700' : '#4a3f8c',
                border: 'none',
                borderTop: tab === t ? '3px solid #ffd700' : '3px solid transparent',
                borderBottom: tab === t ? '3px solid #1a1040' : 'none',
                cursor: 'pointer',
                marginBottom: tab === t ? -3 : 0,
                transition: 'all 0.1s',
              }}
            >
              {t === 'quests' ? '📜 QUESTS' : '⚔ SKILLS'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div style={{ color: '#ffd700', fontSize: '0.6rem' }} className="animate-blink">LOADING...</div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 'quests' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'quests' ? (
              <QuestLog
                tasks={tasks}
                skills={skills}
                onComplete={handleComplete}
                onTasksChanged={loadData}
              />
            ) : (
              <SkillsScreen
                users={users}
                skills={skills}
                highlightSkillId={highlightSkillId}
                onSkillsChanged={loadData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Floating XP */}
      <AnimatePresence>
        {floatingXP && (
          <FloatingXP key={floatingXP.id} xp={floatingXP.xp} color={floatingXP.color} />
        )}
      </AnimatePresence>

      {/* Level Up */}
      <LevelUpModal
        result={levelUpResult?.result ?? null}
        onClose={() => setLevelUpResult(null)}
        spriteId={levelUpResult?.spriteId ?? ''}
      />

    </div>
  );
}
