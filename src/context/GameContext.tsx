import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyChallenge, GradeRecord, TopicProgress, UserProfile } from '../types/game';
import { TopicId } from '../types/math';
import { sound } from '../utils/audio';
import { TOPICS } from '../utils/mathQuestions';
import { ALL_BADGES } from '../utils/badges';
import { enqueueAttempt } from '../utils/offlineQueue';

interface GameContextType {
  profile: UserProfile;
  topicProgress: Record<TopicId, TopicProgress>;
  gradeRecords: GradeRecord[];
  dailyChallenges: DailyChallenge[];
  activeTheme: string;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  loseHeart: () => boolean; // returns true if still alive
  refillHearts: () => void;
  recordAnswer: (topicId: TopicId, isCorrect: boolean, usedVoice: boolean) => void;
  saveGradeRecord: (record: Omit<GradeRecord, 'id' | 'date' | 'formattedDate' | 'status' | 'color'>) => GradeRecord;
  claimChallengeReward: (challengeId: string) => void;
  claimStreakMilestone: (days: number, rewardXp: number, rewardCoins: number) => void;
  claimBadge: (badgeId: string) => void;
  recordDuelWin: () => void;
  buyStreakShield: () => boolean;
  buyItem: (itemId: string, cost: number) => boolean;
  setTheme: (themeId: string) => void;
  setAvatar: (avatarId: string) => void;
  setStudentName: (name: string) => void;
  setStudentParalelo: (paralelo: string) => void;
  setTeacherName: (name: string) => void;
  toggleNotifications: () => Promise<boolean>;
  getAverageGrade: () => number;
}

const STORAGE_KEY_PROFILE = 'algebrik_profile_v2';
const STORAGE_KEY_PROGRESS = 'algebrik_progress_v2';
const STORAGE_KEY_GRADES = 'algebrik_grades_v2';
const STORAGE_KEY_CHALLENGES = 'algebrik_challenges_v2';

const getInitialStreakDates = (daysCount: number): string[] => {
  const dates: string[] = [];
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const INITIAL_PROFILE: UserProfile = {
  name: 'Estudiante de Álgebra',
  studentParalelo: 'Paralelo A',
  teacherName: 'Prof. Ariliz Aponte',
  avatarId: 'cyber_gauss',
  themeId: 'cosmic',
  hearts: 3,
  maxHearts: 3,
  lastHeartLossTime: null,
  xp: 120,
  level: 1,
  coins: 150,
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakHistory: getInitialStreakDates(4),
  streakShieldActive: true,
  claimedStreakMilestones: [3],
  totalExercisesSolved: 14,
  totalVoiceAnswers: 2,
  totalDuelsWon: 1,
  perfectExamsCount: 0,
  unlockedBadgeIds: ['badge-streak-3', 'badge-voice-1', 'badge-duel-1'],
  claimedBadgeIds: ['badge-streak-3'],
  inventory: ['cyber_gauss', 'chalkboard', 'cosmic'],
  notificationsEnabled: false,
  reminderTime: '18:00',
};

const getInitialTopicProgress = (): Record<TopicId, TopicProgress> => {
  const result: Partial<Record<TopicId, TopicProgress>> = {};
  TOPICS.forEach((t, index) => {
    result[t.id] = {
      topicId: t.id,
      exercisesCompleted: index === 0 ? 5 : 0,
      correctCount: index === 0 ? 4 : 0,
      accuracy: index === 0 ? 80 : 0,
      masteryLevel: index === 0 ? 2 : 1,
      unlocked: index <= 2, // First 3 unlocked initially
    };
  });
  return result as Record<TopicId, TopicProgress>;
};

const generateDailyChallenges = (dateStr: string): DailyChallenge[] => [
  {
    id: `dc-1-${dateStr}`,
    date: dateStr,
    title: 'Maestro de la Voz',
    description: 'Resuelve 2 ejercicios utilizando el micrófono por voz',
    targetCount: 2,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardXp: 80,
    rewardCoins: 50,
    icon: '🎙️',
  },
  {
    id: `dc-2-${dateStr}`,
    date: dateStr,
    title: 'Precisión Imparable',
    description: 'Acierta 5 ejercicios seguidos sin perder vidas',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardXp: 120,
    rewardCoins: 80,
    icon: '⚡',
  },
  {
    id: `dc-3-${dateStr}`,
    date: dateStr,
    title: 'Nota Sobresaliente',
    description: 'Completa un examen con nota de 9 o 10 puntos',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    claimed: false,
    rewardXp: 150,
    rewardCoins: 100,
    icon: '🏆',
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return { ...INITIAL_PROFILE, ...JSON.parse(saved) };
    } catch {}
    return INITIAL_PROFILE;
  });

  const [topicProgress, setTopicProgress] = useState<Record<TopicId, TopicProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return getInitialTopicProgress();
  });

  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GRADES);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed initial demo grade record for preview
    return [
      {
        id: 'grade-demo-1',
        studentName: 'Estudiante de Álgebra',
        date: new Date(Date.now() - 86400000).toISOString(),
        formattedDate: new Date(Date.now() - 86400000).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        topicId: 'binomio-cuadrado',
        topicTitle: 'Binomio al Cuadrado',
        scoreOutOfTen: 9.0,
        totalQuestions: 10,
        correctAnswers: 9,
        timeSpentSeconds: 140,
        status: 'Sobresaliente',
        color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
        mistakes: [
          {
            expression: '(2x - 3)²',
            userAnswer: '4x² - 6x + 9',
            correctAnswer: '4x² - 12x + 9',
          },
        ],
      },
    ];
  });

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHALLENGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].date === todayStr) {
          return parsed;
        }
      }
    } catch {}
    return generateDailyChallenges(todayStr);
  });

  // Persist states
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(topicProgress));
    } catch {}
  }, [topicProgress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GRADES, JSON.stringify(gradeRecords));
    } catch {}
  }, [gradeRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(dailyChallenges));
    } catch {}
  }, [dailyChallenges]);

  // Passive heart recovery: regenerate 1 heart every 15 minutes if < 3
  useEffect(() => {
    const timer = setInterval(() => {
      setProfile((prev) => {
        if (prev.hearts < prev.maxHearts && prev.lastHeartLossTime) {
          const elapsed = Date.now() - prev.lastHeartLossTime;
          if (elapsed > 15 * 60 * 1000) {
            return {
              ...prev,
              hearts: Math.min(prev.maxHearts, prev.hearts + 1),
              lastHeartLossTime: prev.hearts + 1 < prev.maxHearts ? Date.now() : null,
            };
          }
        }
        return prev;
      });
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const addXp = (amount: number) => {
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 250) + 1;
      if (newLevel > prev.level) {
        sound.playVictory();
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const addCoins = (amount: number) => {
    setProfile((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const loseHeart = (): boolean => {
    let alive = true;
    sound.playHeartLost();
    sound.vibrate([100, 60, 100]);

    setProfile((prev) => {
      const nextHearts = Math.max(0, prev.hearts - 1);
      alive = nextHearts > 0;
      return {
        ...prev,
        hearts: nextHearts,
        lastHeartLossTime: prev.lastHeartLossTime || Date.now(),
      };
    });

    return alive;
  };

  const refillHearts = () => {
    sound.playVictory();
    setProfile((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
      lastHeartLossTime: null,
    }));
  };

  const recordAnswer = (topicId: TopicId, isCorrect: boolean, usedVoice: boolean) => {
    if (isCorrect) {
      addXp(20);
      addCoins(10);
      sound.playCorrect();
      sound.vibrate(50);

      // Update daily streak & history
      setProfile((prev) => {
        const today = new Date().toISOString().split('T')[0];
        const history = prev.streakHistory || [];
        const alreadyPracticedToday = history.includes(today);

        let newStreak = prev.streakDays;
        const newHistory = alreadyPracticedToday ? history : [...history, today];

        if (!alreadyPracticedToday) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          if (prev.lastActiveDate === yesterday || prev.streakDays === 0) {
            newStreak = prev.streakDays + 1;
          } else if (prev.lastActiveDate !== today) {
            if (prev.streakShieldActive) {
              newStreak = prev.streakDays + 1;
            } else {
              newStreak = 1;
            }
          }
        }

        return {
          ...prev,
          lastActiveDate: today,
          streakDays: newStreak,
          streakHistory: newHistory,
          totalExercisesSolved: (prev.totalExercisesSolved || 0) + 1,
          totalVoiceAnswers: usedVoice ? (prev.totalVoiceAnswers || 0) + 1 : prev.totalVoiceAnswers || 0,
        };
      });
    } else {
      loseHeart();
      sound.playIncorrect();
      sound.vibrate([60, 40, 60]);
    }

    // Enqueue attempt to IndexedDB for offline sync
    enqueueAttempt({
      studentName: profile.name,
      studentParalelo: profile.studentParalelo || 'Paralelo A',
      topicId,
      isCorrect,
      userAnswer: isCorrect ? 'Acierto' : 'Fallo',
      expression: `Práctica - ${topicId}`,
      usedVoice,
      attemptType: 'practice',
    }).catch((err) => console.warn('Offline enqueue error:', err));

    // Update topic progress
    setTopicProgress((prev) => {
      const current = prev[topicId] || {
        topicId,
        exercisesCompleted: 0,
        correctCount: 0,
        accuracy: 0,
        masteryLevel: 1,
        unlocked: true,
      };

      const completed = current.exercisesCompleted + 1;
      const correct = current.correctCount + (isCorrect ? 1 : 0);
      const acc = Math.round((correct / completed) * 100);
      let mastery = 1;
      if (acc >= 90 && completed >= 10) mastery = 5;
      else if (acc >= 80 && completed >= 6) mastery = 4;
      else if (acc >= 70 && completed >= 4) mastery = 3;
      else if (completed >= 2) mastery = 2;

      // Unlock next topic if current reached mastery >= 2
      const topicIndex = TOPICS.findIndex((t) => t.id === topicId);
      const updated = {
        ...prev,
        [topicId]: {
          ...current,
          exercisesCompleted: completed,
          correctCount: correct,
          accuracy: acc,
          masteryLevel: mastery,
        },
      };

      if (mastery >= 2 && topicIndex >= 0 && topicIndex < TOPICS.length - 1) {
        const nextId = TOPICS[topicIndex + 1].id;
        if (updated[nextId]) {
          updated[nextId] = { ...updated[nextId], unlocked: true };
        }
      }

      return updated;
    });

    // Check daily challenges
    setDailyChallenges((prev) =>
      prev.map((ch) => {
        if (ch.completed) return ch;

        // Challenge 1: voice usage
        if (ch.id.startsWith('dc-1') && usedVoice && isCorrect) {
          const next = ch.currentCount + 1;
          return {
            ...ch,
            currentCount: next,
            completed: next >= ch.targetCount,
          };
        }

        // Challenge 2: streak / correct count
        if (ch.id.startsWith('dc-2') && isCorrect) {
          const next = ch.currentCount + 1;
          return {
            ...ch,
            currentCount: next,
            completed: next >= ch.targetCount,
          };
        }

        return ch;
      })
    );
  };

  const saveGradeRecord = (
    data: Omit<GradeRecord, 'id' | 'date' | 'formattedDate' | 'status' | 'color'>
  ): GradeRecord => {
    let status: 'Sobresaliente' | 'Notable' | 'Aprobado' | 'Reprobado' = 'Reprobado';
    let color = 'text-rose-400 bg-rose-950/60 border-rose-500/40';

    if (data.scoreOutOfTen >= 9.0) {
      status = 'Sobresaliente';
      color = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
    } else if (data.scoreOutOfTen >= 7.0) {
      status = 'Notable';
      color = 'text-blue-400 bg-blue-950/60 border-blue-500/40';
    } else if (data.scoreOutOfTen >= 5.0) {
      status = 'Aprobado';
      color = 'text-amber-400 bg-amber-950/60 border-amber-500/40';
    }

    const newRecord: GradeRecord = {
      ...data,
      id: `grade-${Date.now()}`,
      date: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status,
      color,
    };

    setGradeRecords((prev) => [newRecord, ...prev]);

    // Enqueue exam attempt to IndexedDB for offline sync
    enqueueAttempt({
      studentName: data.studentName,
      studentParalelo: profile.studentParalelo || 'Paralelo A',
      topicId: data.topicId,
      topicTitle: data.topicTitle,
      isCorrect: data.scoreOutOfTen >= 5.0,
      userAnswer: `Examen: ${data.scoreOutOfTen.toFixed(1)}/10 (${data.correctAnswers}/${data.totalQuestions})`,
      expression: `Evaluación Formal - ${data.topicTitle}`,
      usedVoice: false,
      scoreOutOfTen: data.scoreOutOfTen,
      timeSpentSeconds: data.timeSpentSeconds,
      attemptType: 'exam',
    }).catch((err) => console.warn('Offline enqueue exam error:', err));

    // Reward for completing exam
    addXp(Math.round(data.scoreOutOfTen * 15));
    addCoins(Math.round(data.scoreOutOfTen * 10));

    if (data.scoreOutOfTen >= 10.0) {
      setProfile((prev) => ({
        ...prev,
        perfectExamsCount: (prev.perfectExamsCount || 0) + 1,
      }));
    }

    // Daily challenge check for score >= 9
    if (data.scoreOutOfTen >= 9.0) {
      setDailyChallenges((prev) =>
        prev.map((ch) =>
          ch.id.startsWith('dc-3')
            ? { ...ch, currentCount: 1, completed: true }
            : ch
        )
      );
    }

    return newRecord;
  };

  const claimChallengeReward = (challengeId: string) => {
    const ch = dailyChallenges.find((c) => c.id === challengeId);
    if (!ch || !ch.completed || ch.claimed) return;

    sound.playVictory();
    addXp(ch.rewardXp);
    addCoins(ch.rewardCoins);

    setDailyChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, claimed: true } : c))
    );
  };

  const claimStreakMilestone = (days: number, rewardXp: number, rewardCoins: number) => {
    sound.playVictory();
    addXp(rewardXp);
    addCoins(rewardCoins);
    setProfile((prev) => ({
      ...prev,
      claimedStreakMilestones: [...(prev.claimedStreakMilestones || []), days],
    }));
  };

  const claimBadge = (badgeId: string) => {
    sound.playVictory();
    const badge = ALL_BADGES.find((b) => b.id === badgeId);
    if (badge) {
      addXp(badge.rewardXp);
      addCoins(badge.rewardCoins);
    }
    setProfile((prev) => ({
      ...prev,
      unlockedBadgeIds: Array.from(new Set([...(prev.unlockedBadgeIds || []), badgeId])),
      claimedBadgeIds: Array.from(new Set([...(prev.claimedBadgeIds || []), badgeId])),
    }));
  };

  const recordDuelWin = () => {
    setProfile((prev) => ({
      ...prev,
      totalDuelsWon: (prev.totalDuelsWon || 0) + 1,
    }));
  };

  const buyStreakShield = (): boolean => {
    if (profile.coins < 80 || profile.streakShieldActive) {
      return false;
    }
    sound.playVictory();
    setProfile((prev) => ({
      ...prev,
      coins: prev.coins - 80,
      streakShieldActive: true,
    }));
    return true;
  };

  const buyItem = (itemId: string, cost: number): boolean => {
    if (profile.coins < cost || profile.inventory.includes(itemId)) {
      return false;
    }
    sound.playVictory();
    setProfile((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      inventory: [...prev.inventory, itemId],
    }));
    return true;
  };

  const setTheme = (themeId: string) => {
    setProfile((prev) => ({ ...prev, themeId }));
  };

  const setAvatar = (avatarId: string) => {
    setProfile((prev) => ({ ...prev, avatarId }));
  };

  const setStudentName = (name: string) => {
    setProfile((prev) => ({ ...prev, name }));
  };

  const setStudentParalelo = (paralelo: string) => {
    setProfile((prev) => ({ ...prev, studentParalelo: paralelo }));
  };

  const setTeacherName = (name: string) => {
    setProfile((prev) => ({ ...prev, teacherName: name }));
  };

  const toggleNotifications = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const next = !profile.notificationsEnabled;
        setProfile((prev) => ({ ...prev, notificationsEnabled: next }));
        return next;
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setProfile((prev) => ({ ...prev, notificationsEnabled: true }));
          new Notification('¡Recordatorio Activado!', {
            body: 'Te avisaremos a las 18:00 para mantener tu racha en Algebrik.',
            icon: '/pwa-192x192.png',
          });
          return true;
        }
      }
    }
    return false;
  };

  const getAverageGrade = (): number => {
    if (gradeRecords.length === 0) return 0;
    const sum = gradeRecords.reduce((acc, r) => acc + r.scoreOutOfTen, 0);
    return Math.round((sum / gradeRecords.length) * 10) / 10;
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        topicProgress,
        gradeRecords,
        dailyChallenges,
        activeTheme: profile.themeId,
        addXp,
        addCoins,
        loseHeart,
        refillHearts,
        recordAnswer,
        saveGradeRecord,
        claimChallengeReward,
        claimStreakMilestone,
        claimBadge,
        recordDuelWin,
        buyStreakShield,
        buyItem,
        setTheme,
        setAvatar,
        setStudentName,
        setStudentParalelo,
        setTeacherName,
        toggleNotifications,
        getAverageGrade,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
