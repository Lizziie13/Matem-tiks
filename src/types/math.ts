export type TopicId =
  | 'binomio-cuadrado'
  | 'diferencia-cuadrados'
  | 'binomio-termino-comun'
  | 'factor-comun'
  | 'trinomio-simple'
  | 'trinomio-compuesto'
  | 'cubos-notables';

export type ExerciseType = 'expand' | 'factor';

export interface TopicInfo {
  id: TopicId;
  title: string;
  shortTitle: string;
  description: string;
  formula: string;
  level: number;
  badgeIcon: string;
  color: string;
}

export interface Exercise {
  id: string;
  topicId: TopicId;
  type: ExerciseType;
  level: number;
  prompt: string; // The problem statement, e.g. "Desarrolla el binomio al cuadrado:" or "Factoriza:"
  expression: string; // e.g. "(x + 3)^2" or "x^2 - 16"
  displayExpression: string; // Formatted display, e.g. "(x + 3)²"
  acceptableAnswers: string[]; // List of normalized canonical acceptable representations
  correctAnswerFormatted: string; // Prettified answer for display e.g. "x² + 6x + 9"
  stepByStep: string[]; // Explanatory breakdown
  hint: string; // Quick tip
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  userAnswerRaw: string;
  userAnswerNormalized: string;
  feedback: string;
  correctAnswerFormatted: string;
  stepByStep: string[];
}
