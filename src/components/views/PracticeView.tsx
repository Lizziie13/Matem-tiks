import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Flame, Lock, Play, RefreshCw, Trophy } from 'lucide-react';
import { TopicId } from '../../types/math';
import { AnswerValidationResult } from '../../types/math';
import { useGame } from '../../context/GameContext';
import { generateDynamicExercise, getExerciseSet, TOPICS } from '../../utils/mathQuestions';
import { ExerciseCard } from '../ExerciseCard';
import { sound } from '../../utils/audio';

export const PracticeView: React.FC = () => {
  const { topicProgress, recordAnswer, profile } = useGame();

  const [selectedTopicId, setSelectedTopicId] = useState<TopicId | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });

  const startTopicPractice = (topicId: TopicId) => {
    sound.playTap();
    setSelectedTopicId(topicId);
    const initialSet = getExerciseSet(topicId, 5);
    setExercises(initialSet);
    setCurrentIndex(0);
    setSessionScore({ correct: 0, total: 0 });
  };

  const handleAnswerValidated = (result: AnswerValidationResult, usedVoice: boolean) => {
    if (!selectedTopicId) return;

    recordAnswer(selectedTopicId, result.isCorrect, usedVoice);
    setSessionScore((prev) => ({
      correct: prev.correct + (result.isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Generate more procedural exercises for continuous practice
      if (selectedTopicId) {
        const nextEx = generateDynamicExercise(selectedTopicId, 2);
        setExercises((prev) => [...prev, nextEx]);
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const currentExercise = exercises[currentIndex];
  const activeTopicInfo = TOPICS.find((t) => t.id === selectedTopicId);

  // If a topic is selected, render practice session
  if (selectedTopicId && currentExercise && activeTopicInfo) {
    return (
      <div className="space-y-4 max-w-xl mx-auto animate-in fade-in">
        {/* Top Practice Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTopicId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Temas</span>
          </button>

          <div className="text-center">
            <h2 className="text-sm font-bold text-white">{activeTopicInfo.shortTitle}</h2>
            <p className="text-[11px] text-slate-400">
              Ejercicio {currentIndex + 1} · Aciertos: {sessionScore.correct}/{sessionScore.total}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playTap();
              const fresh = generateDynamicExercise(selectedTopicId, 2);
              setExercises((prev) => [...prev.slice(0, currentIndex), fresh, ...prev.slice(currentIndex + 1)]);
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition border border-slate-700/60"
            title="Cambiar por otro ejercicio aleatorio"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Bar of Session */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{
              width: `${Math.min(100, ((currentIndex + 1) / Math.max(5, exercises.length)) * 100)}%`,
            }}
          />
        </div>

        {/* The interactive Exercise Card */}
        <ExerciseCard
          exercise={currentExercise}
          onAnswerValidated={handleAnswerValidated}
          onNext={handleNext}
        />
      </div>
    );
  }

  // Topic Level Selection Menu
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
      <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Niveles de Práctica Progresiva
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Aprende paso a paso desde binomios al cuadrado hasta cubos notables y trinomios avanzados.
          </p>
        </div>

        <div className="flex items-center gap-2 self-center sm:self-auto px-3.5 py-1.5 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>Racha de {profile.streakDays} días activos</span>
        </div>
      </div>

      {/* Grid of Topics / Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TOPICS.map((topic, index) => {
          const progress = topicProgress[topic.id] || {
            exercisesCompleted: 0,
            correctCount: 0,
            accuracy: 0,
            masteryLevel: 1,
            unlocked: index === 0,
          };

          const isUnlocked = progress.unlocked || index <= 2;

          return (
            <div
              key={topic.id}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                isUnlocked
                  ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
                  : 'bg-slate-900/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white font-black text-lg shadow-md`}
                    >
                      {topic.badgeIcon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                        Nivel {topic.level}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                        {topic.title}
                      </h3>
                    </div>
                  </div>

                  {!isUnlocked ? (
                    <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xs ${
                            star <= progress.masteryLevel ? 'text-amber-400' : 'text-slate-700'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                  {topic.description}
                </p>

                {/* Formula Highlight */}
                <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/60 font-mono text-xs font-bold text-slate-300">
                  {topic.formula}
                </div>

                {/* Footer with stats & action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {progress.exercisesCompleted > 0
                      ? `${progress.accuracy}% precisión (${progress.correctCount}/${progress.exercisesCompleted})`
                      : 'Sin iniciar'}
                  </span>

                  {isUnlocked ? (
                    <button
                      onClick={() => startTopicPractice(topic.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Practicar</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Completa el nivel anterior
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
