import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import db from '../db';

const joinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part(4)}-${part(4)}`;
}

// POST /api/parties — create a new party
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Party name required' });

  let code = generateCode();
  // Retry on the rare collision
  for (let i = 0; i < 5; i++) {
    const exists = db.prepare('SELECT id FROM parties WHERE code = ?').get(code);
    if (!exists) break;
    code = generateCode();
  }

  const result = db.prepare('INSERT INTO parties (code, name) VALUES (?, ?)').run(code, name.trim());
  const party = db.prepare('SELECT * FROM parties WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(party);
});

// GET /api/parties/:code — look up a party by code (rate limited)
router.get('/:code', joinLimiter, (req, res) => {
  const party = db.prepare('SELECT * FROM parties WHERE code = ?').get(req.params.code.toUpperCase());
  if (!party) return res.status(404).json({ error: 'Party not found' });
  res.json(party);
});

export default router;
