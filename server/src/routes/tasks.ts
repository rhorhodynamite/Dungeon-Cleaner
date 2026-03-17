import { Router } from 'express';
import db, { applyXP, xpForNextLevel } from '../db';

const router = Router();

const TASK_SELECT = `
  SELECT t.*,
    s.name as skill_name, s.icon as skill_icon, s.color as skill_color,
    u.id as user_id, u.name as user_name, u.sprite as user_sprite, u.color as user_color
  FROM tasks t
  JOIN skills s ON t.skill_id = s.id
  JOIN users u ON s.user_id = u.id
`;

router.get('/', (req, res) => {
  const { skill_id, completed } = req.query;
  let query = TASK_SELECT + ' WHERE u.party_id = ?';
  const params: any[] = [req.partyId];

  if (skill_id)                { query += ' AND t.skill_id = ?';  params.push(skill_id); }
  if (completed !== undefined) { query += ' AND t.completed = ?'; params.push(completed === 'true' ? 1 : 0); }
  query += ' ORDER BY t.created_at DESC';

  res.json(db.prepare(query).all(...params));
});

router.post('/', (req, res) => {
  const { title, skill_id, xp_reward } = req.body;
  if (!title?.trim() || !skill_id) return res.status(400).json({ error: 'title and skill_id required' });

  // Verify skill belongs to this party
  const skill = db.prepare(`
    SELECT s.id FROM skills s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND u.party_id = ?
  `).get(skill_id, req.partyId);
  if (!skill) return res.status(403).json({ error: 'Skill not in your party' });

  const xp = Number(xp_reward) || 50;
  const result = db.prepare('INSERT INTO tasks (title, skill_id, xp_reward) VALUES (?, ?, ?)').run(title.trim(), skill_id, xp);
  const task = db.prepare(TASK_SELECT + ' WHERE t.id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

router.put('/:id/complete', (req, res) => {
  // Verify task belongs to this party
  const task = db.prepare(
    `SELECT t.* FROM tasks t JOIN skills s ON t.skill_id = s.id JOIN users u ON s.user_id = u.id WHERE t.id = ? AND u.party_id = ?`
  ).get(req.params.id, req.partyId) as any;
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (task.completed) return res.status(400).json({ error: 'Already completed' });

  const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(task.skill_id) as any;
  const { newLevel, newXp, leveledUp, levelsGained } = applyXP(skill.level, skill.xp, task.xp_reward);

  db.prepare('UPDATE tasks SET completed = 1, completed_at = CURRENT_TIMESTAMP WHERE id = ?').run(task.id);
  db.prepare('UPDATE skills SET level = ?, xp = ? WHERE id = ?').run(newLevel, newXp, skill.id);

  res.json({
    xpGained: task.xp_reward,
    leveledUp, levelsGained,
    oldLevel: skill.level, newLevel, newXp,
    xpToNextLevel: xpForNextLevel(newLevel),
    skillName: skill.name, skillIcon: skill.icon,
  });
});

router.delete('/:id', (req, res) => {
  db.prepare(`
    DELETE FROM tasks WHERE id = ? AND skill_id IN (
      SELECT s.id FROM skills s JOIN users u ON s.user_id = u.id WHERE u.party_id = ?
    )
  `).run(req.params.id, req.partyId);
  res.status(204).send();
});

export default router;
