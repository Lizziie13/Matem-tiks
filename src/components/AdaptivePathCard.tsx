import React, { useEffect, useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TOPICS } from '../utils/mathQuestions';
import { sound } from '../utils/audio';
import { TopicId } from '../types/math';
import { AdaptivePracticeModal } from './AdaptivePracticeModal';

export const AdaptivePathCard: React.FC = () => {
  const { profile, topicProgress } = useGame();

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [diagnosticSummary, setDiagnosticSummary] = useState<string>('');
  const [recommendedDifficulty, setRecommendedDifficulty] = useState<number>(1);
  const [difficultyReason, setDifficultyReason] = useState<string>('');
  const [smartTips, setSmartTips] = useState<string[]>([]);
  const [recommendedTopicIds, setRecommendedTopicIds] = useState<TopicId[]>(['binomio-cuadrado']);
  const [aiSource, setAiSource] = useState<string>('');
  const [showPracticeModal, setShowPracticeModal] = useState(false);

  // Identify weak topics from local context
  const weakTopics = TOPICS.filter((t) => {
    const prog = topicProgress[t.id];
    return prog && prog.exercisesCompleted > 0 && prog.accuracy < 75;
  });

  // Untested topics
  const unpracticedTopics = TOPICS.filter((t) => {
    const prog = topicProgress[t.id];
    return !prog || prog.exercisesCompleted === 0;
  });

  const fetchAiAdaptivePath = async () => {
    setIsLoadingAi(true);
    sound.playTap();

    try {
      const response = await fetch('/api/adaptive-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile.name,
          studentParalelo: profile.studentParalelo,
          topicProgress,
          streakDays: profile.streakDays,
          level: profile.level,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiagnosticSummary(data.diagnosticSummary || '');
        setRecommendedDifficulty(data.recommendedDifficulty || 1);
        setDifficultyReason(data.difficultyReason || '');
        setSmartTips(data.smartTips || []);
        if (data.recommendedTopicIds && data.recommendedTopicIds.length > 0) {
          setRecommendedTopicIds(data.recommendedTopicIds as TopicId[]);
        }
        setAiSource(data.source || 'adaptive-engine');
      } else {
        throw new Error('API response not ok');
      }
    } catch (err) {
      // Fallback local diagnosis
      const weakest = weakTopics.length > 0 ? weakTopics[0].id : 'binomio-cuadrado';
      setRecommendedTopicIds(weakTopics.length > 0 ? weakTopics.map((w) => w.id) : ['binomio-cuadrado', 'diferencia-cuadrados']);
      const level = weakTopics.length > 0 && (topicProgress[weakest]?.accuracy || 0) < 50 ? 1 : 2;
      setRecommendedDifficulty(level);
      setDiagnosticSummary(
        weakTopics.length > 0
          ? `Diagnóstico de la IA: Se detectó que tu rendimiento requiere refuerzo en "${weakTopics[0].shortTitle}" (${topicProgress[weakest]?.accuracy || 0}% de efectividad). La dificultad se ha calibrado a Nivel ${level} para consolidar tu aprendizaje paso a paso.`
          : 'Diagnóstico de la IA: ¡Gran trabajo! Tus bases algebraicas están estables. La ruta adaptativa te asignará ejercicios balanceados de Nivel 2 para continuar progresando con confianza.'
      );
      setDifficultyReason(`Nivel ${level} asignado para afianzar productos notables y factorización.`);
      setSmartTips([
        'En (a - b)², recuerda que el término medio es negativo (-2ab) pero el cuadrado final es positivo (+b²).',
        'En diferencia de cuadrados (a+b)(a-b) = a² - b², nunca queda término intermedio.',
        'Al factorizar trinomios x² + bx + c, busca dos números que multiplicados den c y sumados den b.',
      ]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchAiAdaptivePath();
  }, []);

  const handleStartPractice = () => {
    sound.playTap();
    setShowPracticeModal(true);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 p-5 sm:p-6 shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/20">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400">
                  Inteligencia Artificial Adaptativa
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  En tiempo real
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Ruta de Aprendizaje Adaptativa
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAiAdaptivePath}
              disabled={isLoadingAi}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 transition active:scale-95 disabled:opacity-50"
              title="Recalcular diagnóstico adaptativo con IA"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{isLoadingAi ? 'Analizando...' : 'Actualizar IA'}</span>
            </button>

            <button
              onClick={handleStartPractice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Entrenar Ruta</span>
            </button>
          </div>
        </div>

        {/* Diagnosis & Current Difficulty Calibrated */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* Diagnostic Message */}
          <div className="md:col-span-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Diagnóstico Pedagógico Personalizado</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {diagnosticSummary ||
                'Analizando tu historial de ejercicios y efectividad para construir una secuencia adaptativa personalizada...'}
            </p>

            {/* Target Topics Pills */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400">Temas prioritarios:</span>
              {recommendedTopicIds.map((tid) => {
                const topic = TOPICS.find((t) => t.id === tid);
                const prog = topicProgress[tid];
                return (
                  <span
                    key={tid}
                    className="px-2.5 py-1 rounded-xl text-xs font-bold bg-indigo-950/60 text-indigo-200 border border-indigo-500/30 flex items-center gap-1.5"
                  >
                    <span>{topic?.shortTitle || tid}</span>
                    {prog && prog.exercisesCompleted > 0 && (
                      <span className="text-[10px] font-mono text-indigo-400">
                        ({prog.accuracy}%)
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Difficulty Gauge */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Dificultad Calibrada
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">
                  Nivel {recommendedDifficulty}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    recommendedDifficulty === 3
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : recommendedDifficulty === 2
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {recommendedDifficulty === 3 ? 'Avanzado' : recommendedDifficulty === 2 ? 'Intermedio' : 'Básico'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {difficultyReason || 'Ajustada dinámicamente según aciertos y errores recientes.'}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              {[1, 2, 3].map((lvl) => (
                <div
                  key={lvl}
                  className={`flex items-center gap-1 font-bold text-[11px] ${
                    lvl === recommendedDifficulty
                      ? 'text-indigo-400'
                      : lvl < recommendedDifficulty
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      lvl === recommendedDifficulty
                        ? 'bg-indigo-600 text-white shadow'
                        : lvl < recommendedDifficulty
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    {lvl}
                  </span>
                  <span>{lvl === 1 ? 'Básico' : lvl === 2 ? 'Medio' : 'Desafío'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Tips Section */}
        {smartTips.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Consejos Clave de la IA para tus Temas Débiles</span>
            </div>
            <ul className="space-y-1.5">
              {smartTips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Practice Modal */}
      <AdaptivePracticeModal
        isOpen={showPracticeModal}
        onClose={() => setShowPracticeModal(false)}
        initialTopicIds={recommendedTopicIds}
        initialDifficulty={recommendedDifficulty}
      />
    </>
  );
};
