import { Badge, GradeRecord, TopicProgress, UserProfile } from '../types/game';
import { TopicId } from '../types/math';

export const ALL_BADGES: Badge[] = [
  // --- RACHA ---
  {
    id: 'badge-streak-3',
    title: 'Chispa de Constancia',
    description: 'Mantén una racha de práctica de 3 días consecutivos.',
    category: 'racha',
    targetCount: 3,
    icon: '🔥',
    rarity: 'Bronce',
    rewardXp: 60,
    rewardCoins: 40,
  },
  {
    id: 'badge-streak-7',
    title: 'Semana de Fuego',
    description: 'Completa una racha de 7 días consecutivos sin apagar tu llama.',
    category: 'racha',
    targetCount: 7,
    icon: '⚡',
    rarity: 'Plata',
    rewardXp: 150,
    rewardCoins: 100,
  },
  {
    id: 'badge-streak-14',
    title: 'Guardián de la Disciplina',
    description: 'Alcanza 14 días consecutivos de aprendizaje matemático.',
    category: 'racha',
    targetCount: 14,
    icon: '🛡️',
    rarity: 'Oro',
    rewardXp: 300,
    rewardCoins: 200,
  },
  {
    id: 'badge-streak-30',
    title: 'Corona Solar Eterna',
    description: '¡Hito supremo! Mantén tu racha durante 30 días consecutivos.',
    category: 'racha',
    targetCount: 30,
    icon: '👑',
    rarity: 'Legendario',
    rewardXp: 600,
    rewardCoins: 400,
  },

  // --- EJERCICIOS ---
  {
    id: 'badge-ex-10',
    title: 'Primeros Pasos Algebraicos',
    description: 'Resuelve tus primeros 10 ejercicios correctamente.',
    category: 'ejercicios',
    targetCount: 10,
    icon: '🌱',
    rarity: 'Bronce',
    rewardXp: 50,
    rewardCoins: 30,
  },
  {
    id: 'badge-ex-50',
    title: 'Calculador Incansable',
    description: 'Alcanza 50 ejercicios resueltos con éxito.',
    category: 'ejercicios',
    targetCount: 50,
    icon: '⚙️',
    rarity: 'Plata',
    rewardXp: 140,
    rewardCoins: 90,
  },
  {
    id: 'badge-ex-100',
    title: 'Centenario del Álgebra',
    description: '¡100 ejercicios resueltos! Demuestra tu dominio en factorización.',
    category: 'ejercicios',
    targetCount: 100,
    icon: '💯',
    rarity: 'Oro',
    rewardXp: 350,
    rewardCoins: 250,
  },
  {
    id: 'badge-ex-250',
    title: 'Cerebro Cuántico',
    description: 'Resuelve 250 ejercicios algebraicos acumulados.',
    category: 'ejercicios',
    targetCount: 250,
    icon: '🧠',
    rarity: 'Diamante',
    rewardXp: 700,
    rewardCoins: 500,
  },

  // --- EXÁMENES ---
  {
    id: 'badge-exam-perfect',
    title: 'Perfección 10/10',
    description: 'Obtén una calificación perfecta de 10.0 en cualquier examen oficial.',
    category: 'examenes',
    targetCount: 1,
    icon: '🌟',
    rarity: 'Oro',
    rewardXp: 200,
    rewardCoins: 120,
  },
  {
    id: 'badge-exam-3-perfect',
    title: 'Trilogía de Excelencia',
    description: 'Consigue 3 exámenes evaluados con nota perfecta de 10 sobre 10.',
    category: 'examenes',
    targetCount: 3,
    icon: '🏆',
    rarity: 'Diamante',
    rewardXp: 450,
    rewardCoins: 300,
  },
  {
    id: 'badge-exam-5-approved',
    title: 'Récord Académico Impecable',
    description: 'Aprueba 5 exámenes con calificación Sobresaliente o Notable.',
    category: 'examenes',
    targetCount: 5,
    icon: '📜',
    rarity: 'Plata',
    rewardXp: 180,
    rewardCoins: 100,
  },

  // --- ESPECIAL / VOZ / DUELOS ---
  {
    id: 'badge-voice-1',
    title: 'Voz del Álgebra',
    description: 'Resuelve tu primer ejercicio dictando la respuesta mediante la voz.',
    category: 'especial',
    targetCount: 1,
    icon: '🎙️',
    rarity: 'Bronce',
    rewardXp: 75,
    rewardCoins: 50,
  },
  {
    id: 'badge-voice-10',
    title: 'Orador de Polinomios',
    description: 'Resuelve 10 ejercicios dictando fórmulas matemáticas por voz.',
    category: 'especial',
    targetCount: 10,
    icon: '🔊',
    rarity: 'Plata',
    rewardXp: 200,
    rewardCoins: 140,
  },
  {
    id: 'badge-duel-1',
    title: 'Gladiador de la Arena',
    description: 'Gana tu primer Duelo Fantasma contra un compañero o bot rival.',
    category: 'especial',
    targetCount: 1,
    icon: '⚔️',
    rarity: 'Plata',
    rewardXp: 120,
    rewardCoins: 80,
  },
  {
    id: 'badge-duel-5',
    title: 'Invicto del Multijugador',
    description: 'Triunfa en 5 duelos asíncronos contrarreloj.',
    category: 'especial',
    targetCount: 5,
    icon: '🏅',
    rarity: 'Oro',
    rewardXp: 300,
    rewardCoins: 200,
  },
];

export function getBadgeCurrentProgress(
  badge: Badge,
  profile: UserProfile,
  gradeRecords: GradeRecord[]
): { current: number; isUnlocked: boolean; percentage: number } {
  let current = 0;

  switch (badge.id) {
    case 'badge-streak-3':
    case 'badge-streak-7':
    case 'badge-streak-14':
    case 'badge-streak-30':
      current = profile.streakDays || 0;
      break;

    case 'badge-ex-10':
    case 'badge-ex-50':
    case 'badge-ex-100':
    case 'badge-ex-250':
      current = profile.totalExercisesSolved || 0;
      break;

    case 'badge-exam-perfect':
      current = gradeRecords.filter((r) => r.scoreOutOfTen >= 10.0).length;
      break;

    case 'badge-exam-3-perfect':
      current = gradeRecords.filter((r) => r.scoreOutOfTen >= 10.0).length;
      break;

    case 'badge-exam-5-approved':
      current = gradeRecords.filter((r) => r.scoreOutOfTen >= 7.0).length;
      break;

    case 'badge-voice-1':
    case 'badge-voice-10':
      current = profile.totalVoiceAnswers || 0;
      break;

    case 'badge-duel-1':
    case 'badge-duel-5':
      current = profile.totalDuelsWon || 0;
      break;

    default:
      current = 0;
  }

  const isUnlocked = current >= badge.targetCount;
  const percentage = Math.min(100, Math.round((current / badge.targetCount) * 100));

  return { current, isUnlocked, percentage };
}
