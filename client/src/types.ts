export interface User {
  id: number;
  name: string;
  sprite: string;
  color: string;
  totalLevel: number;
  questsDone: number;
  created_at: string;
}

export interface Skill {
  id: number;
  user_id: number;
  user_name: string;
  user_sprite: string;
  user_color: string;
  name: string;
  icon: string;
  color: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  skill_id: number;
  skill_name: string;
  skill_icon: string;
  skill_color: string;
  xp_reward: number;
  completed: number;
  completed_at: string | null;
  created_at: string;
  user_id: number;
  user_name: string;
  user_sprite: string;
  user_color: string;
}

export interface CompleteTaskResult {
  xpGained: number;
  leveledUp: boolean;
  levelsGained: number;
  oldLevel: number;
  newLevel: number;
  newXp: number;
  xpToNextLevel: number;
  skillName: string;
  skillIcon: string;
}

export type XpReward = 25 | 50 | 100 | 200;

export const XP_LABELS: Record<XpReward, string> = {
  25: 'Quick',
  50: 'Normal',
  100: 'Hard',
  200: 'Epic',
};
