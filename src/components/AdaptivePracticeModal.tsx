import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Shield,
  Trophy,
  X,
  Volume2,
} from 'lucide-react';
import { Exercise, TopicId } from '../types/math';
import { useGame } from '../context/GameContext';
import { validateMathAnswer } from '../utils/mathEngine';
import { generateDynamicExercise, TOPICS } from '../utils/mathQuestions';
import { sound } from '../utils/audio';
import { MathKeyboard } from './MathKeyboard';
import { VoiceInputButton } from './VoiceInputButton';
import { StepByStepModal } from './StepByStepModal';

interface AdaptivePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicIds?: TopicId[];
  initialDifficulty?: number;
}

export const AdaptivePracticeModal: React.FC<AdaptivePracticeModalProps> = ({
  isOpen,
  onClose,
  initialTopicIds = ['binomio-cuadrado', 'diferencia-cuadrados'],
  initialDifficulty = 1,
}) => {
  const { profile, recordAnswer, addCoins, addXp } = useGame();

  const [currentDifficulty, setCurrentDifficulty] = useState<number>(initialDifficulty);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [totalSessionExercises, setTotalSessionExercises] = useState(5);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [difficultyDelta, setDifficultyDelta] = useState<'up' | 'down' | 'same' | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Session stats
  const [correctCount, setCorrectCount] = useState(0);
  const [streakInSession, setStreakInSession] = useState(0);
  const [difficultyHistory, setDifficultyHistory] = useState<number[]>([initialDifficulty]);

  // Generate an exercise based on adaptive difficulty and target topics
  const pickNextExercise = (difficulty: number, idx: number) => {
    // Alternate between target weak topics
    const topicId = initialTopicIds[idx % initialTopicIds.length] || 'binomio-cuadrado';
    const ex = generateDynamicExercise(topicId, difficulty);
    return ex;
  };

  // Init on open
  useEffect(() => {
    if (isOpen) {
      setCurrentDifficulty(initialDifficulty);
      setExerciseIndex(0);
      setCorrectCount(0);
      setStreakInSession(0);
      setSessionCompleted(false);
      setDifficultyHistory([initialDifficulty]);
      const first = pickNextExercise(initialDifficulty, 0);
      setCurrentExercise(first);
      setUserAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
      setFeedbackMsg('');
      setDifficultyDelta(null);
      setShowHint(false);
    }
  }, [isOpen, initialDifficulty]);

  if (!isOpen || !currentExercise) return null;

  const handleValidateAnswer = () => {
    if (!userAnswer.trim() || isAnswered || !currentExercise) return;

    const result = validateMathAnswer(userAnswer, currentExercise);
    setIsAnswered(true);
    setIsCorrect(result.isCorrect);

    // Record progress in context
    recordAnswer(currentExercise.topicId, result.isCorrect, false);

    if (result.isCorrect) {
      sound.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      setCorrectCount((prev) => prev + 1);
      const newStreak = streakInSession + 1;
      setStreakInSession(newStreak);
      addCoins(5);
      addXp(15 * currentDifficulty);

      // Adaptive difficulty scaling up:
      // If student is correct and difficulty < 3, promote difficulty!
      let nextDiff = currentDifficulty;
      if (currentDifficulty < 3 && newStreak >= 1) {
        nextDiff = Math.min(3, currentDifficulty + 1);
        setDifficultyDelta('up');
        setFeedbackMsg(
          nextDiff === 2
            ? '¡Excelente precisión! La IA ha subido la dificultad a Nivel 2 (Intermedio).'
            : '¡Impresionante dominio! La IA ha subido la dificultad al Nivel 3 (Avanzado / Desafío).'
        );
      } else {
        setDifficultyDelta('same');
        setFeedbackMsg('¡Respuesta correcta! Gran agilidad mental.');
      }
      setCurrentDifficulty(nextDiff);
      setDifficultyHistory((prev) => [...prev, nextDiff]);
    } else {
      sound.playError();
      setStreakInSession(0);

      // Adaptive difficulty scaling down or scaffolding:
      let nextDiff = currentDifficulty;
      if (currentDifficulty > 1) {
        nextDiff = Math.max(1, currentDifficulty - 1);
        setDifficultyDelta('down');
        setFeedbackMsg(
          'No te preocupes. La IA ha calibrado la dificultad a un nivel más accesible para reforzar la base.'
        );
      } else {
        setDifficultyDelta('same');
        setFeedbackMsg(
          'Revisa el paso a paso detallado para aprender la regla y volver a intentarlo.'
        );
      }
      setCurrentDifficulty(nextDiff);
      setDifficultyHistory((prev) => [...prev, nextDiff]);
    }
  };

  const handleNextExercise = () => {
    sound.playTap();
    const nextIdx = exerciseIndex + 1;
    if (nextIdx >= totalSessionExercises) {
      // Completed session
      setSessionCompleted(true);
      sound.playWin();
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
      return;
    }

    setExerciseIndex(nextIdx);
    const nextEx = pickNextExercise(currentDifficulty, nextIdx);
    setCurrentExercise(nextEx);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(null);
    setFeedbackMsg('');
    setDifficultyDelta(null);
    setShowHint(false);
  };

  const currentTopicInfo = TOPICS.find((t) => t.id === currentExercise.topicId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
                  Ruta Adaptativa IA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ejercicio {exerciseIndex + 1} de {totalSessionExercises}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {currentTopicInfo?.title || 'Productos Notables'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Real-time difficulty badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition ${
                currentDifficulty === 3
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                  : currentDifficulty === 2
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                Nivel {currentDifficulty}:{' '}
                {currentDifficulty === 3 ? 'Avanzado' : currentDifficulty === 2 ? 'Intermedio' : 'Básico'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((exerciseIndex + (isAnswered ? 1 : 0)) / totalSessionExercises) * 100}%` }}
          />
        </div>

        {!sessionCompleted ? (
          <div>
            {/* Adaptive feedback banner when difficulty adjusts */}
            {difficultyDelta && (
              <div
                className={`mb-4 p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-medium animate-in fade-in ${
                  difficultyDelta === 'up'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : difficultyDelta === 'down'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                }`}
              >
                {difficultyDelta === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />}
                {difficultyDelta === 'down' && <TrendingDown className="w-4 h-4 text-amber-400 shrink-0" />}
                {difficultyDelta === 'same' && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />}
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Exercise Prompt */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-5">
              <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block mb-1">
                {currentExercise.prompt}
              </span>
              <div className="py-3 text-center">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                  {currentExercise.displayExpression}
                </span>
              </div>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2 animate-in fade-in">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Pista adaptativa: {currentExercise.hint}</span>
              </div>
            )}

            {/* Answer Input Area */}
            <div className="space-y-3 mb-5">
              <div className="relative">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isAnswered) {
                      handleValidateAnswer();
                    }
                  }}
                  disabled={isAnswered}
                  placeholder="Escribe tu resultado (ej. x^2 + 8x + 16 o (x+4)(x-4))"
                  className={`w-full px-4 py-3.5 rounded-2xl bg-slate-800/80 border text-white font-mono text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 transition ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/20'
                        : 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-950/20'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
                  }`}
                />

                {/* Voice button inside input */}
                {!isAnswered && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <VoiceInputButton
                      onTranscriptReady={(mathText: string) => {
                        setUserAnswer(mathText);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Virtual Keyboard Toggle & Hint Toggle */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                  >
                    {showKeyboard ? 'Ocultar teclado matemático' : 'Teclado matemático (², x, +, -)'}
                  </button>

                  {!showHint && !isAnswered && (
                    <button
                      type="button"
                      onClick={() => setShowHint(true)}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 transition flex items-center gap-1"
                    >
                      <Lightbulb className="w-3 h-3" />
                      Pista
                    </button>
                  )}
                </div>

                {isAnswered && !isCorrect && (
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Ver solución paso a paso
                  </button>
                )}
              </div>

              {/* Math Keyboard Display */}
              {showKeyboard && !isAnswered && (
                <div className="mt-2 animate-in fade-in">
                  <MathKeyboard
                    onInsert={(char) => setUserAnswer((prev) => prev + char)}
                    onBackspace={() => setUserAnswer((prev) => prev.slice(0, -1))}
                    onClear={() => setUserAnswer('')}
                    onSubmit={handleValidateAnswer}
                  />
                </div>
              )}
            </div>

            {/* Answer Feedback Display */}
            {isAnswered && (
              <div
                className={`p-4 rounded-2xl border mb-5 animate-in fade-in ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isCorrect ? '¡Correcto!' : 'Respuesta Incorrecta'}
                    </h4>
                    <p className="text-xs mt-1">
                      {isCorrect
                        ? '¡Excelente razonamiento algebraico! Has respondido satisfactoriamente.'
                        : `La respuesta correcta es: ${currentExercise.correctAnswerFormatted}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {!isAnswered ? (
                <button
                  onClick={handleValidateAnswer}
                  disabled={!userAnswer.trim()}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-2"
                >
                  <span>Validar Respuesta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextExercise}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center gap-2"
                >
                  <span>
                    {exerciseIndex + 1 >= totalSessionExercises ? 'Finalizar Sesión' : 'Siguiente Ejercicio'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Session Completed View */
          <div className="text-center py-6 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">¡Sesión Adaptativa Completada!</h3>
              <p className="text-sm text-slate-300 mt-1">
                La IA ha actualizado tus estadísticas de progreso y reforzado tus temas débiles.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Aciertos</span>
                <span className="text-xl font-mono font-black text-white">
                  {correctCount}/{totalSessionExercises}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Dificultad Final</span>
                <span className="text-xl font-mono font-black text-indigo-400">
                  Nivel {currentDifficulty}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Recompensas</span>
                <span className="text-xl font-mono font-black text-amber-400">
                  +{correctCount * 15} 🪙
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95"
              >
                Volver al Panel de Progreso
              </button>
            </div>
          </div>
        )}

        {/* Step-by-Step Guidance Modal */}
        {currentExercise && (
          <StepByStepModal
            exercise={currentExercise}
            isOpen={showHelpModal}
            onClose={() => setShowHelpModal(false)}
          />
        )}
      </div>
    </div>
  );
};
