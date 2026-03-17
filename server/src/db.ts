// @ts-ignore — node:sqlite types land in @types/node ≥22
import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_PATH = process.env.DB_PATH ?? path.join(__dirname, '../../rpg-todo.db');
const db = new DatabaseSync(DB_PATH);

db.exec(`PRAGMA journal_mode = WAL`);
db.exec(`PRAGMA foreign_keys = ON`);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS parties (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    party_id INTEGER REFERENCES parties(id) ON DELETE CASCADE,
    name     TEXT NOT NULL,
    sprite   TEXT NOT NULL DEFAULT 'knight',
    color    TEXT NOT NULL DEFAULT '#ff6b35',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(party_id, name)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS skills (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name    TEXT NOT NULL,
    icon    TEXT NOT NULL DEFAULT '⚔️',
    color   TEXT NOT NULL DEFAULT '#6b5ca5',
    level   INTEGER NOT NULL DEFAULT 1,
    xp      INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, name)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    skill_id   INTEGER NOT NULL,
    xp_reward  INTEGER NOT NULL DEFAULT 50,
    completed  INTEGER NOT NULL DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
  );
`);

// ── Migrate existing users that predate party_id ─────────────────────────────
const userCols = (db.prepare(`PRAGMA table_info(users)`).all() as any[]).map((c: any) => c.name);
if (!userCols.includes('party_id')) {
  db.exec(`INSERT OR IGNORE INTO parties (code, name) VALUES ('LEGACY-0000', 'Legacy Party')`);
  const legacy = db.prepare(`SELECT id FROM parties WHERE code = 'LEGACY-0000'`).get() as any;
  db.exec(`ALTER TABLE users ADD COLUMN party_id INTEGER`);
  db.prepare(`UPDATE users SET party_id = ?`).run(legacy.id);
}

export default db;

export function xpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function applyXP(currentLevel: number, currentXp: number, xpGain: number): {
  newLevel: number; newXp: number; leveledUp: boolean; levelsGained: number;
} {
  let level = currentLevel;
  let xp = currentXp + xpGain;
  let levelsGained = 0;
  while (true) {
    const needed = xpForNextLevel(level);
    if (xp >= needed) { xp -= needed; level++; levelsGained++; }
    else break;
  }
  return { newLevel: level, newXp: xp, leveledUp: levelsGained > 0, levelsGained };
}
