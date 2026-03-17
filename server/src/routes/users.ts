import { Router } from 'express';
import db, { xpForNextLevel } from '../db';

const router = Router();

router.get('/', (_req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY created_at ASC').all() as any[];
  // Attach total level for each user
  const withStats = users.map(u => {
    const skills = db.prepare('SELECT level FROM skills WHERE user_id = ?').all(u.id) as any[];
    const totalLevel = skills.reduce((sum: number, s: any) => sum + s.level, 0);
    const questsDone = (db.prepare(
      `SELECT COUNT(*) as c FROM tasks t JOIN skills s ON t.skill_id = s.id WHERE s.user_id = ? AND t.completed = 1`
    ).get(u.id) as any).c;
    return { ...u, totalLevel, questsDone };
  });
  res.json(withStats);
});

router.post('/', (req, res) => {
  const { name, sprite, color } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
  try {
    const result = db.prepare(
      'INSERT INTO users (name, sprite, color) VALUES (?, ?, ?)'
    ).run(name.trim(), sprite || 'knight', color || '#ff6b35');

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as any;

    // Seed default skills for new user
    const seedSkills = [
      { name: 'Cleaning', icon: '🧹', color: '#4488ff' },
      { name: 'Laundry',  icon: '👕', color: '#aa44ff' },
      { name: 'Fitness',  icon: '💪', color: '#ff6b35' },
      { name: 'Cooking',  icon: '🍳', color: '#ffcc00' },
    ];
    for (const s of seedSkills) {
      db.prepare('INSERT INTO skills (user_id, name, icon, color) VALUES (?, ?, ?, ?)').run(user.id, s.name, s.icon, s.color);
    }

    res.status(201).json({ ...user, totalLevel: 4, questsDone: 0 });
  } catch (e: any) {
    if (e.message.includes('UNIQUE')) return res.status(409).json({ error: 'Name already taken' });
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
