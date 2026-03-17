import type { User, Skill, Task, CompleteTaskResult } from './types';

const BASE = '/api';

// ── Users ──────────────────────────────────────────────────────
export async function fetchUsers(): Promise<User[]> {
  return (await fetch(`${BASE}/users`)).json();
}

export async function createUser(data: { name: string; sprite: string; color: string }): Promise<User> {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  await fetch(`${BASE}/users/${id}`, { method: 'DELETE' });
}

// ── Skills ─────────────────────────────────────────────────────
export async function fetchSkills(userId: number): Promise<Skill[]> {
  return (await fetch(`${BASE}/skills?user_id=${userId}`)).json();
}

export async function fetchAllSkills(): Promise<Skill[]> {
  return (await fetch(`${BASE}/skills`)).json();
}

export async function createSkill(data: { name: string; icon: string; color: string; user_id: number }): Promise<Skill> {
  const res = await fetch(`${BASE}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function deleteSkill(id: number): Promise<void> {
  await fetch(`${BASE}/skills/${id}`, { method: 'DELETE' });
}

// ── Tasks ──────────────────────────────────────────────────────
export async function fetchTasks(): Promise<Task[]> {
  return (await fetch(`${BASE}/tasks`)).json();
}

export async function createTask(data: { title: string; skill_id: number; xp_reward: number }): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function completeTask(id: number): Promise<CompleteTaskResult> {
  const res = await fetch(`${BASE}/tasks/${id}/complete`, { method: 'PUT' });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
}
