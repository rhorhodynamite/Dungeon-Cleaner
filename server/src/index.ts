import express from 'express';
import cors from 'cors';
import path from 'path';
import usersRouter from './routes/users';
import skillsRouter from './routes/skills';
import tasksRouter from './routes/tasks';
import './db';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve portrait images from server/portraits/
app.use('/portraits', express.static(path.join(process.cwd(), 'portraits')));

app.use('/api/users', usersRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/tasks', tasksRouter);

app.listen(PORT, () => {
  console.log(`⚔️  RPG-Todo server running on http://localhost:${PORT}`);
});
