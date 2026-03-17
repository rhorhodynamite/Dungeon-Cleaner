import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import db from './db';
import usersRouter from './routes/users';
import skillsRouter from './routes/skills';
import tasksRouter from './routes/tasks';
import partiesRouter from './routes/parties';

// Extend Express Request with partyId
declare global {
  namespace Express {
    interface Request { partyId: number; }
  }
}

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

// Serve portrait images and built frontend
app.use('/portraits', express.static(path.join(__dirname, '../portraits')));

const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');
app.use(express.static(CLIENT_DIST));

// Parties — no auth required
app.use('/api/parties', partiesRouter);

// Party middleware — all /api routes below require X-Party-Code
function requireParty(req: Request, res: Response, next: NextFunction) {
  const code = (req.headers['x-party-code'] as string | undefined)?.toUpperCase();
  if (!code) return res.status(401).json({ error: 'Missing party code' });
  const party = db.prepare('SELECT id FROM parties WHERE code = ?').get(code) as any;
  if (!party) return res.status(401).json({ error: 'Invalid party code' });
  req.partyId = party.id;
  next();
}

app.use('/api/users',  requireParty, usersRouter);
app.use('/api/skills', requireParty, skillsRouter);
app.use('/api/tasks',  requireParty, tasksRouter);

// SPA catch-all — serve index.html for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`⚔️  RPG-Todo server running on http://localhost:${PORT}`);
});
