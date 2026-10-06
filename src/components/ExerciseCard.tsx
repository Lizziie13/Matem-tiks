import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Keyboard,
} from 'lucide-react';
import { AnswerValidationResult, Exercise } from '../types/math';
import { validateAnswer, formatMathForDisplay } from '../utils/mathEngine';
import { MathKeyboard } from './MathKeyboard';
import { VoiceInputButton } from './VoiceInputButton';
import { StepByStepModal } from './StepByStepModal';
import { sound } from '../utils/audio';

interface ExerciseCardProps {
  exercise: Exercise;
  onAnswerValidated: (result: AnswerValidationResult, usedVoice: boolean) => void;
  onNext?: () => void;
  showNextButton?: boolean;
  isDuelMode?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onAnswerValidated,
  onNext,
  showNextButton = true,
  isDuelMode = false,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [validation, setValidation] = useState<AnswerValidationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [usedVoice, setUsedVoice] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when exercise changes
  useEffect(() => {
    setUserAnswer('');
    setValidation(null);
    setShowHint(false);
    setShowSteps(false);
    setUsedVoice(false);
    inputRef.current?.focus();
  }, [exercise.id]);

  const handleValidate = () => {
    if (!userAnswer.trim()) return;

    const res = validateAnswer(userAnswer, exercise);
    setValidation(res);
    onAnswerValidated(res, usedVoice);

    if (res.isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.75 },
      });
    }
  };

  const handleVoiceInput = (mathText: string) => {
    setUsedVoice(true);
    setUserAnswer(mathText);
    // Instant validation on voice answer
    const res = validateAnswer(mathText, exercise);
    setValidation(res);
    onAnswerValidated(res, true);
    if (res.isCorrect) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  };

  const handleInsertChar = (char: string) => {
    setUserAnswer((prev) => prev + char);
  };

  const handleBackspace = () => {
    setUserAnswer((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setUserAnswer('');
    setValidation(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleValidate();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative">
      {/* Header bar with topic badge & level */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            Nivel {exercise.level}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {exercise.type === 'expand' ? 'Desarrollo de Producto' : 'Factorización'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className={`p-1.5 rounded-lg border text-xs font-medium transition ${
              showHint
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Ver pista"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowSteps(true)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition"
            title="Ver paso a paso"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
            className={`p-1.5 rounded-lg border transition ${
              showVirtualKeyboard
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Alternar teclado matemático"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercise Prompt */}
      <div className="text-center py-2">
        <h3 className="text-sm font-medium text-slate-300 mb-1.5">
          {exercise.prompt}
        </h3>
        <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-800/40 border border-slate-700/80 shadow-inner">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-wide text-white">
            {exercise.displayExpression}
          </span>
        </div>
      </div>

      {/* Hint Alert */}
      {showHint && exercise.hint && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Pista:</strong> {exercise.hint}
          </div>
        </div>
      )}

      {/* Input Field + Voice Button */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-slate-400 mb-1.5">
          Tu respuesta (escribe con teclado o usa la voz):
        </label>
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value);
                setValidation(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={validation?.isCorrect}
              placeholder="Ej: x² + 6x + 9 o (x+3)(x-3)"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-base sm:text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-inner"
            />
            {userAnswer && !validation?.isCorrect && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-indigo-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
                {formatMathForDisplay(userAnswer)}
              </span>
            )}
          </div>

          <VoiceInputButton
            onTranscriptReady={handleVoiceInput}
            disabled={validation?.isCorrect}
          />
        </div>
      </div>

      {/* Immediate Validation Feedback Banner */}
      {validation && (
        <div
          className={`mt-4 p-4 rounded-2xl border transition-all animate-in fade-in duration-200 ${
            validation.isCorrect
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              {validation.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {validation.feedback}
                </p>
                {!validation.isCorrect && (
                  <p className="text-xs text-rose-300 mt-1">
                    Solución: <span className="font-mono font-bold text-white">{validation.correctAnswerFormatted}</span>
                  </p>
                )}
                {validation.isCorrect && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-emerald-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>+20 XP · +10 Monedas</span>
                  </div>
                )}
              </div>
            </div>

            {!validation.isCorrect && (
              <button
                type="button"
                onClick={() => setShowSteps(true)}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold whitespace-nowrap transition"
              >
                Ver Paso a Paso
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons: Validar or Siguiente */}
      <div className="mt-4 flex items-center justify-between gap-3">
        {!validation ? (
          <button
            type="button"
            onClick={handleValidate}
            disabled={!userAnswer.trim()}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base transition shadow-lg shadow-indigo-600/30 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Validar Respuesta</span>
          </button>
        ) : (
          <div className="w-full flex items-center gap-3">
            {!validation.isCorrect && (
              <button
                type="button"
                onClick={() => {
                  setUserAnswer('');
                  setValidation(null);
                  inputRef.current?.focus();
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
            )}

            {showNextButton && onNext && (
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onNext();
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <span>Siguiente Ejercicio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile-Friendly Virtual Math Keyboard */}
      {showVirtualKeyboard && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <MathKeyboard
            onInsert={handleInsertChar}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onSubmit={handleValidate}
            canSubmit={!!userAnswer.trim() && !validation?.isCorrect}
          />
        </div>
      )}

      {/* Step by step modal */}
      <StepByStepModal
        exercise={exercise}
        isOpen={showSteps}
        onClose={() => setShowSteps(false)}
      />
    </div>
  );
};
