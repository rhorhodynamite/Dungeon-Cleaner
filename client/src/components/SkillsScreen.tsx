import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, Skill } from '../types';
import { CLASS_COLORS } from './PixelCharacter';
import SkillCard from './SkillCard';
import AddSkillModal from './AddSkillModal';
import CreateCharacterModal from './CreateCharacterModal';
import { deleteSkill, deleteUser } from '../api';

interface Props {
  users: User[];
  skills: Skill[];
  highlightSkillId: number | null;
  onSkillsChanged: () => void;
}

export default function SkillsScreen({ users, skills, highlightSkillId, onSkillsChanged }: Props) {
  const [selectedUserId, setSelectedUserId] = useState<number>(users[0]?.id ?? 0);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddHero, setShowAddHero] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<User | null>(null);

  const selectedUser = users.find(u => u.id === selectedUserId) ?? users[0];
  const memberSkills = skills.filter(s => s.user_id === selectedUserId);

  async function handleDeleteSkill(id: number) {
    if (!confirm('Delete this skill and all its quests?')) return;
    await deleteSkill(id);
    onSkillsChanged();
  }

  async function handleDeleteUser(user: User) {
    await deleteUser(user.id);
    setConfirmDeleteUser(null);
    const remaining = users.filter(u => u.id !== user.id);
    setSelectedUserId(remaining[0]?.id ?? 0);
    onSkillsChanged();
  }

  if (users.length === 0) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="pixel-window-gold p-3 mb-4 flex items-center justify-between">
          <div style={{ color: '#ffd700', fontSize: '0.55rem' }}>⚔ SKILL BOARD</div>
          <button
            className="pixel-btn"
            onClick={() => setShowAddHero(true)}
            style={{ fontSize: '0.38rem', padding: '3px 8px' }}
          >
            + ADD HERO
          </button>
        </div>
        <div className="pixel-window p-8 text-center" style={{ color: '#4a3f8c', fontSize: '0.6rem' }}>
          NO HEROES YET...<br /><br />ADD A HERO TO BEGIN!
        </div>
        <AnimatePresence>
          {showAddHero && (
            <CreateCharacterModal
              onClose={() => setShowAddHero(false)}
              onCreated={newUser => {
                onSkillsChanged();
                setSelectedUserId(newUser.id);
                setShowAddHero(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Member selector */}
      <div className="pixel-window-gold p-3 mb-4">
        <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
          <div style={{ color: '#ffd700', fontSize: '0.55rem' }}>⚔ SKILL BOARD</div>
          <button
            className="pixel-btn"
            onClick={() => setShowAddHero(true)}
            style={{ fontSize: '0.38rem', padding: '3px 8px' }}
          >
            + ADD HERO
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {users.map(user => {
            const color = CLASS_COLORS[user.sprite] ?? '#6b5ca5';
            const isSelected = user.id === selectedUserId;
            return (
              <div key={user.id} className="flex items-center" style={{ gap: 0 }}>
                <button
                  onClick={() => setSelectedUserId(user.id)}
                  style={{
                    background: isSelected ? '#1a1040' : 'transparent',
                    border: `2px solid ${isSelected ? color : '#2d1b69'}`,
                    borderRight: 'none',
                    color: isSelected ? color : '#4a3f8c',
                    fontSize: '0.42rem',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontFamily: '"Press Start 2P"',
                    transition: 'all 0.1s',
                    boxShadow: isSelected ? `0 0 6px ${color}44` : 'none',
                  }}
                >
                  {user.name}
                </button>
                <button
                  onClick={() => setConfirmDeleteUser(user)}
                  title="Delete hero"
                  style={{
                    background: isSelected ? '#1a1040' : 'transparent',
                    border: `2px solid ${isSelected ? color : '#2d1b69'}`,
                    color: '#4a3f8c',
                    fontSize: '0.5rem',
                    padding: '5px 6px',
                    cursor: 'pointer',
                    fontFamily: '"Press Start 2P"',
                    transition: 'all 0.1s',
                    lineHeight: 1,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#ff3333')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#4a3f8c')}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected member header */}
      <div className="flex items-center justify-between mb-4">
        <div style={{ color: CLASS_COLORS[selectedUser?.sprite ?? ''] ?? '#6b5ca5', fontSize: '0.5rem' }}>
          {selectedUser?.name}'S SKILLS
        </div>
        <button className="pixel-btn pixel-btn-primary" onClick={() => setShowAdd(true)}>
          + NEW SKILL
        </button>
      </div>

      {memberSkills.length === 0 ? (
        <div className="pixel-window p-8 text-center" style={{ color: '#4a3f8c', fontSize: '0.6rem' }}>
          NO SKILLS YET...<br /><br />ADD YOUR FIRST SKILL TO BEGIN!
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AnimatePresence>
            {memberSkills.map(skill => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onDelete={handleDeleteSkill}
                highlight={skill.id === highlightSkillId}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {showAdd && selectedUser && (
          <AddSkillModal
            userId={selectedUser.id}
            onClose={() => setShowAdd(false)}
            onCreated={() => { onSkillsChanged(); setShowAdd(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddHero && (
          <CreateCharacterModal
            onClose={() => setShowAddHero(false)}
            onCreated={newUser => {
              onSkillsChanged();
              setSelectedUserId(newUser.id);
              setShowAddHero(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDeleteUser && (
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
                {confirmDeleteUser.name.toUpperCase()}'S SKILLS<br />AND QUESTS WILL BE LOST.
              </div>
              <div className="flex gap-3">
                <button className="pixel-btn pixel-btn-primary flex-1" onClick={() => setConfirmDeleteUser(null)}>CANCEL</button>
                <button className="pixel-btn pixel-btn-red flex-1" onClick={() => handleDeleteUser(confirmDeleteUser)}>DELETE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
