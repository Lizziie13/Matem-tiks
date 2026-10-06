import React from 'react';
import { BookOpen, CheckCircle2, Lightbulb, X } from 'lucide-react';
import { Exercise } from '../types/math';

interface StepByStepModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export const StepByStepModal: React.FC<StepByStepModalProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Procedimiento Paso a Paso</h3>
        </div>

        {/* Exercise display */}
        <div className="mt-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            {exercise.prompt}
          </span>
          <span className="text-2xl font-bold font-mono text-indigo-300">
            {exercise.displayExpression}
          </span>
        </div>

        {/* Quick Hint */}
        {exercise.hint && (
          <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Tip de la regla: </strong>
              {exercise.hint}
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Desarrollo algebraico:
          </h4>
          {exercise.stepByStep.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/40 text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="text-slate-200 leading-relaxed font-mono text-xs sm:text-sm">
                {step}
              </div>
            </div>
          ))}
        </div>

        {/* Final Answer Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-emerald-300">Respuesta Correcta:</span>
          </div>
          <span className="text-base font-bold font-mono text-emerald-300">
            {exercise.correctAnswerFormatted}
          </span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
        >
          ¡Listo, continuar practicando!
        </button>
      </div>
    </div>
  );
};
