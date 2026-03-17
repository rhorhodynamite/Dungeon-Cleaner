import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Skill, Task } from '../types';
import QuestItem from './QuestItem';
import AddQuestModal from './AddQuestModal';
import { deleteTask } from '../api';

interface Props {
  tasks: Task[];
  skills: Skill[];
  onComplete: (id: number) => void;
  onTasksChanged: () => void;
}

type Filter = 'active' | 'completed' | 'all';

export default function QuestLog({ tasks, skills, onComplete, onTasksChanged }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<Filter>('active');
  const [memberFilter, setMemberFilter] = useState<number | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState<number | 'all'>('all');

  // Unique members derived from skills
  const members = Array.from(new Map(skills.map(s => [s.user_id, { id: s.user_id, name: s.user_name }])).values());

  const filtered = tasks.filter(t => {
    if (filter === 'active' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (memberFilter !== 'all' && t.user_id !== memberFilter) return false;
    if (skillFilter !== 'all' && t.skill_id !== skillFilter) return false;
    return true;
  });

  // When member filter changes, reset skill filter
  const visibleSkills = memberFilter === 'all' ? skills : skills.filter(s => s.user_id === memberFilter);

  async function handleDelete(id: number) {
    await deleteTask(id);
    onTasksChanged();
  }

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Title bar */}
      <div className="pixel-window-gold p-3 mb-4 flex items-center justify-between">
        <div style={{ color: '#ffd700', fontSize: '0.7rem' }}>
          📜 QUEST LOG
          {activeCount > 0 && (
            <span style={{
              marginLeft: 10, background: '#ff3333', color: '#fff',
              fontSize: '0.5rem', padding: '2px 6px', border: '1px solid #ff6666',
            }}>
              {activeCount}
            </span>
          )}
        </div>
        <button
          className="pixel-btn pixel-btn-primary"
          onClick={() => setShowAdd(true)}
          disabled={skills.length === 0}
        >
          + NEW QUEST
        </button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {(['active', 'completed', 'all'] as Filter[]).map(f => (
          <button
            key={f}
            className="pixel-btn"
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? '#2d1b69' : '#0a0820',
              border: `2px solid ${filter === f ? '#ffd700' : '#4a3f8c'}`,
              color: filter === f ? '#ffd700' : '#6b5ca5',
              fontSize: '0.5rem', padding: '5px 10px',
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Member + skill filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          className="pixel-btn"
          onClick={() => { setMemberFilter('all'); setSkillFilter('all'); }}
          style={{
            background: memberFilter === 'all' ? '#2d1b69' : '#0a0820',
            border: `2px solid ${memberFilter === 'all' ? '#ffd700' : '#4a3f8c'}`,
            color: memberFilter === 'all' ? '#ffd700' : '#6b5ca5',
            fontSize: '0.42rem', padding: '5px 10px',
          }}
        >
          ALL
        </button>
        {members.map(m => (
          <button
            key={m.id}
            className="pixel-btn"
            onClick={() => { setMemberFilter(m.id); setSkillFilter('all'); }}
            style={{
              background: memberFilter === m.id ? '#2d1b69' : '#0a0820',
              border: `2px solid ${memberFilter === m.id ? '#ffd700' : '#4a3f8c'}`,
              color: memberFilter === m.id ? '#ffd700' : '#6b5ca5',
              fontSize: '0.42rem', padding: '5px 10px',
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Skill filter (only when a member is selected) */}
      {memberFilter !== 'all' && visibleSkills.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            className="pixel-btn"
            onClick={() => setSkillFilter('all')}
            style={{
              background: skillFilter === 'all' ? '#1a1040' : '#0a0820',
              border: `2px solid ${skillFilter === 'all' ? '#6b5ca5' : '#4a3f8c'}`,
              color: skillFilter === 'all' ? '#a070ff' : '#6b5ca5',
              fontSize: '0.38rem', padding: '4px 8px',
            }}
          >
            ALL SKILLS
          </button>
          {visibleSkills.map(s => (
            <button
              key={s.id}
              className="pixel-btn"
              onClick={() => setSkillFilter(s.id)}
              style={{
                background: skillFilter === s.id ? '#1a1040' : '#0a0820',
                border: `2px solid ${skillFilter === s.id ? s.color : '#4a3f8c'}`,
                color: skillFilter === s.id ? s.color : '#6b5ca5',
                fontSize: '0.38rem', padding: '4px 8px',
              }}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Quest list */}
      {skills.length === 0 ? (
        <div className="pixel-window p-8 text-center" style={{ color: '#4a3f8c', fontSize: '0.6rem' }}>
          ADD A SKILL TO A HERO FIRST<br /><br />
          VISIT THE SKILL BOARD →
        </div>
      ) : filtered.length === 0 ? (
        <div className="pixel-window p-8 text-center" style={{ color: '#4a3f8c', fontSize: '0.6rem' }}>
          {filter === 'active' ? 'NO ACTIVE QUESTS...' : 'NOTHING HERE YET...'}
          <br /><br />
          {filter === 'active' && '▶ ADD A QUEST TO BEGIN YOUR ADVENTURE'}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map(task => (
              <QuestItem
                key={task.id}
                task={task}
                onComplete={onComplete}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showAdd && (
          <AddQuestModal
            skills={skills}
            onClose={() => setShowAdd(false)}
            onCreated={() => { onTasksChanged(); setShowAdd(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
