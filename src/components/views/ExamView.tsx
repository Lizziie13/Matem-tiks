import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';
import { Exercise, TopicId } from '../../types/math';
import { AnswerValidationResult } from '../../types/math';
import { useGame } from '../../context/GameContext';
import { getExerciseSet, TOPICS } from '../../utils/mathQuestions';
import { ExerciseCard } from '../ExerciseCard';
import { sound } from '../../utils/audio';

export const ExamView: React.FC<{ onNavigateToGrades?: () => void }> = ({
  onNavigateToGrades,
}) => {
  const { profile, saveGradeRecord } = useGame();

  const [examStatus, setExamStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [selectedTopic, setSelectedTopic] = useState<TopicId | 'mixed'>('mixed');
  const [questions, setQuestions] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    { exercise: Exercise; result: AnswerValidationResult; usedVoice: boolean }[]
  >([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [completedRecord, setCompletedRecord] = useState<any>(null);

  // Timer while running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examStatus === 'running') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examStatus]);

  const startExam = (topic: TopicId | 'mixed') => {
    sound.playTap();
    setSelectedTopic(topic);
    const examQuestions = getExerciseSet(topic, 10);
    setQuestions(examQuestions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setExamStatus('running');
  };

  const handleAnswerValidated = (result: AnswerValidationResult, usedVoice: boolean) => {
    const currentEx = questions[currentIndex];
    setUserAnswers((prev) => [...prev, { exercise: currentEx, result, usedVoice }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Exam finished! Calculate score out of 10
      const total = questions.length;
      const correct = userAnswers.filter((a) => a.result.isCorrect).length;
      const score = Math.round((correct / total) * 10 * 10) / 10; // e.g. 8.0, 9.0, 10.0

      const mistakes = userAnswers
        .filter((a) => !a.result.isCorrect)
        .map((a) => ({
          expression: a.exercise.displayExpression,
          userAnswer: a.result.userAnswerRaw || 'Sin respuesta',
          correctAnswer: a.result.correctAnswerFormatted,
        }));

      const topicTitle =
        selectedTopic === 'mixed'
          ? 'Examen Integral Mixto de Álgebra'
          : TOPICS.find((t) => t.id === selectedTopic)?.title || 'Examen de Álgebra';

      const saved = saveGradeRecord({
        studentName: profile.name,
        topicId: selectedTopic,
        topicTitle,
        scoreOutOfTen: score,
        totalQuestions: total,
        correctAnswers: correct,
        timeSpentSeconds: elapsedSeconds,
        mistakes,
      });

      setCompletedRecord(saved);
      setExamStatus('completed');

      if (score >= 7.0) {
        sound.playVictory();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        sound.playIncorrect();
      }
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // 1. Exam running view
  if (examStatus === 'running' && questions[currentIndex]) {
    const currentEx = questions[currentIndex];
    const hasAnsweredCurrent = userAnswers.length > currentIndex;

    return (
      <div className="space-y-4 max-w-xl mx-auto animate-in fade-in">
        {/* Exam Header HUD */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-slate-200">
              Evaluación Calificada (Sobre 10)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 text-xs font-mono font-bold text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <div className="text-xs font-bold text-indigo-400">
            Pregunta {currentIndex + 1} de {questions.length}
          </div>
        </div>

        {/* Question progress ticks */}
        <div className="grid grid-cols-10 gap-1">
          {questions.map((_, i) => {
            const answered = userAnswers[i];
            let bg = 'bg-slate-800';
            if (i === currentIndex) bg = 'bg-indigo-500 ring-2 ring-indigo-400';
            else if (answered) bg = answered.result.isCorrect ? 'bg-emerald-500' : 'bg-rose-500';

            return <div key={i} className={`h-2 rounded-full transition-all ${bg}`} />;
          })}
        </div>

        {/* Current Question Exercise Card */}
        <ExerciseCard
          exercise={currentEx}
          onAnswerValidated={handleAnswerValidated}
          onNext={handleNextQuestion}
          showNextButton={hasAnsweredCurrent}
        />
      </div>
    );
  }

  // 2. Exam Completed View (Results & Certificate)
  if (examStatus === 'completed' && completedRecord) {
    const isApproved = completedRecord.scoreOutOfTen >= 5.0;

    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
        <div className="text-center p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Background glow */}
          <div
            className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
              isApproved ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />

          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-slate-800/80 border border-slate-700 mb-3">
              <Award
                className={`w-10 h-10 ${
                  completedRecord.scoreOutOfTen >= 9.0
                    ? 'text-amber-400'
                    : isApproved
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              />
            </div>

            <h2 className="text-2xl font-black text-white">Evaluación Finalizada</h2>
            <p className="text-xs text-slate-400 mt-1">{completedRecord.topicTitle}</p>
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-300 font-semibold mt-1">
              <span>{completedRecord.studentName} ({profile.studentParalelo || 'Paralelo A'})</span>
              <span>·</span>
              <span className="text-slate-400">Docente: {profile.teacherName || 'Prof. Ariliz Aponte'}</span>
            </div>

            {/* Score Big Display */}
            <div className="my-6">
              <span className="text-xs uppercase tracking-widest text-slate-400 block font-bold mb-1">
                Calificación Oficial
              </span>
              <div className="flex items-baseline justify-center gap-1 font-mono">
                <span
                  className={`text-6xl font-black ${
                    completedRecord.scoreOutOfTen >= 9.0
                      ? 'text-emerald-400'
                      : completedRecord.scoreOutOfTen >= 7.0
                      ? 'text-blue-400'
                      : completedRecord.scoreOutOfTen >= 5.0
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {completedRecord.scoreOutOfTen.toFixed(1)}
                </span>
                <span className="text-2xl text-slate-500 font-bold">/ 10</span>
              </div>

              <div className="mt-2">
                <span
                  className={`inline-block px-4 py-1 rounded-full text-xs font-bold border ${completedRecord.color}`}
                >
                  {completedRecord.status}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Aciertos
                </span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {completedRecord.correctAnswers} / {completedRecord.totalQuestions}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Tiempo
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {formatTimer(completedRecord.timeSpentSeconds)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Efectividad
                </span>
                <span className="text-base font-bold text-indigo-400 font-mono">
                  {Math.round(
                    (completedRecord.correctAnswers / completedRecord.totalQuestions) * 100
                  )}
                  %
                </span>
              </div>
            </div>

            {/* Mistakes Breakdown if any */}
            {completedRecord.mistakes.length > 0 && (
              <div className="mt-5 text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Preguntas para corregir ({completedRecord.mistakes.length})</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {completedRecord.mistakes.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs"
                    >
                      <div className="font-mono font-bold text-slate-200">{m.expression}</div>
                      <div className="flex items-center justify-between mt-1 text-[11px]">
                        <span className="text-rose-400">Tu respuesta: {m.userAnswer}</span>
                        <span className="text-emerald-400 font-mono font-semibold">
                          Correcta: {m.correctAnswer}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setExamStatus('idle')}
                className="w-full sm:flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Presentar Otro Examen</span>
              </button>

              {onNavigateToGrades && (
                <button
                  onClick={onNavigateToGrades}
                  className="w-full sm:flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Ver en Registro de Notas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Exam Selection Lobby (idle)
  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
      <div className="text-center">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Sistema de Calificación 10/10
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
          Evaluaciones Calificadas
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Pon a prueba tus conocimientos bajo condiciones de examen. Cada prueba califica sobre 10
          puntos y queda registrada en tu historial académico.
        </p>
      </div>

      {/* Featured Big Exam: Examen Integral Mixto */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-bold text-[10px] uppercase">
                Recomendado
              </span>
              <span className="text-xs text-indigo-300 font-semibold">10 Preguntas</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Examen General de Álgebra (Todos los Temas)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Incluye binomios al cuadrado, diferencia de cuadrados, factor común y trinomios.
            </p>
          </div>

          <button
            onClick={() => startExam('mixed')}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 whitespace-nowrap"
          >
            <span>Iniciar Examen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Or choose a specific topic */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          O rinde examen por tema específico:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => startExam(topic.id)}
              className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white font-bold text-sm shadow`}
                >
                  {topic.badgeIcon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                    {topic.shortTitle}
                  </h4>
                  <span className="text-[11px] text-slate-400">10 preguntas</span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
