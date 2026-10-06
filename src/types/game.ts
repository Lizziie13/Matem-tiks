import { TopicId } from './math';

export interface UserProfile {
  name: string;
  studentParalelo: string; // e.g. "Paralelo A"
  teacherName: string; // e.g. "Prof. Ariliz Aponte"
  avatarId: string;
  themeId: string;
  hearts: number; // 0 - 3
  maxHearts: number;
  lastHeartLossTime: number | null; // For auto-refill timer
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakHistory: string[]; // List of YYYY-MM-DD dates practiced
  streakShieldActive: boolean; // Protection against missing a day
  claimedStreakMilestones: number[]; // Claimed streak milestone days (e.g. [3, 7, 14, 30])
  totalExercisesSolved: number;
  totalVoiceAnswers: number;
  totalDuelsWon: number;
  perfectExamsCount: number;
  unlockedBadgeIds: string[];
  claimedBadgeIds: string[];
  inventory: string[]; // unlocked avatar or theme ids
  notificationsEnabled: boolean;
  reminderTime: string; // e.g. "18:00"
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'racha' | 'ejercicios' | 'examenes' | 'especial';
  targetCount: number;
  icon: string;
  rarity: 'Bronce' | 'Plata' | 'Oro' | 'Diamante' | 'Legendario';
  rewardXp: number;
  rewardCoins: number;
}

export interface TopicProgress {
  topicId: TopicId;
  exercisesCompleted: number;
  correctCount: number;
  accuracy: number; // 0 - 100
  masteryLevel: number; // 1 - 5 stars
  unlocked: boolean;
}

export interface GradeRecord {
  id: string;
  studentName: string;
  date: string; // ISO string
  formattedDate: string;
  topicId: TopicId | 'mixed';
  topicTitle: string;
  scoreOutOfTen: number; // e.g. 9.5
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  status: 'Sobresaliente' | 'Notable' | 'Aprobado' | 'Reprobado';
  color: string;
  mistakes: {
    expression: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardXp: number;
  rewardCoins: number;
  icon: string;
}

export interface DuelRecord {
  code: string;
  challengerName: string;
  challengerAvatar: string;
  challengerScoreOutOfTen: number;
  challengerTimeSeconds: number;
  topicId: TopicId | 'mixed';
  seed: number;
  createdAt: number;
}
