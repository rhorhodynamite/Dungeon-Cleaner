import { Router } from 'express';
import db, { xpForNextLevel } from '../db';

const router = Router();

const SKILL_SELECT = `
  SELECT s.*, u.name as user_name, u.sprite as user_sprite, u.color as user_color
  FROM skills s JOIN users u ON s.user_id = u.id
`;

router.get('/', (req, res) => {
  const { user_id } = req.query;
  const rows = user_id
    ? db.prepare(SKILL_SELECT + ' WHERE s.user_id = ? ORDER BY s.name ASC').all(String(user_id)) as any[]
    : db.prepare(SKILL_SELECT + ' ORDER BY u.id, s.name ASC').all() as any[];
  res.json(rows.map(s => ({ ...s, xpToNextLevel: xpForNextLevel(s.level) })));
});

router.post('/', (req, res) => {
  const { name, icon, color, user_id } = req.body;
  if (!name?.trim() || !user_id) return res.status(400).json({ error: 'name and user_id required' });
  try {
    const result = db.prepare(
      'INSERT INTO skills (user_id, name, icon, color) VALUES (?, ?, ?, ?)'
    ).run(user_id, name.trim(), icon || '⚔️', color || '#6b5ca5');
    const skill = db.prepare(SKILL_SELECT + ' WHERE s.id = ?').get(result.lastInsertRowid) as any;
    res.status(201).json({ ...skill, xpToNextLevel: xpForNextLevel(skill.level) });
  } catch (e: any) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Skill already exists' });
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
