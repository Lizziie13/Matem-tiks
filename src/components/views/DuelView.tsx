import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Bot,
  Check,
  Clock,
  Copy,
  Flame,
  Play,
  RotateCcw,
  Share2,
  Swords,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { Exercise } from '../../types/math';
import { AnswerValidationResult } from '../../types/math';
import { useGame } from '../../context/GameContext';
import { getExerciseSet } from '../../utils/mathQuestions';
import { ExerciseCard } from '../ExerciseCard';
import { sound } from '../../utils/audio';
import { CyberAvatar, CYBER_AVATARS } from '../CyberAvatar';
import { CyberAvatarSelectorModal } from '../CyberAvatarSelectorModal';
import { QuickDuelOnline } from './QuickDuelOnline';
import { QuickDuelLocalSplit } from './QuickDuelLocalSplit';

interface GhostOpponent {
  id: string;
  name: string;
  avatar: string;
  scoreOutOfTen: number;
  timeSeconds: number;
  difficulty: 'Fácil' | 'Media' | 'Difícil' | 'Épico';
}

const BOT_OPPONENTS: GhostOpponent[] = [
  {
    id: 'bot-1',
    name: 'Mateo Quantum-Novato',
    avatar: 'cyber_valkyrie',
    scoreOutOfTen: 6.0,
    timeSeconds: 65,
    difficulty: 'Fácil',
  },
  {
    id: 'bot-2',
    name: 'Valentina Cyber-Lovelace',
    avatar: 'cyber_lovelace',
    scoreOutOfTen: 8.0,
    timeSeconds: 45,
    difficulty: 'Media',
  },
  {
    id: 'bot-3',
    name: 'Prof. Gauss Cyber-Titan',
    avatar: 'cyber_gauss',
    scoreOutOfTen: 10.0,
    timeSeconds: 38,
    difficulty: 'Difícil',
  },
  {
    id: 'bot-4',
    name: 'Algebrik-Bot 9000',
    avatar: 'cyber_quantum_bot',
    scoreOutOfTen: 10.0,
    timeSeconds: 30,
    difficulty: 'Épico',
  },
];

export const DuelView: React.FC = () => {
  const { profile, addCoins, addXp, recordDuelWin } = useGame();

  const [duelMode, setDuelMode] = useState<'quick_online' | 'quick_local' | 'ghost'>('quick_online');
  const [duelState, setDuelState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [activeOpponent, setActiveOpponent] = useState<GhostOpponent>(BOT_OPPONENTS[1]);
  const [customDuelCode, setCustomDuelCode] = useState('');
  const [createdDuelCode, setCreatedDuelCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const [questions, setQuestions] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerValidationResult[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [ghostProgress, setGhostProgress] = useState(0);

  // Timer & Ghost simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (duelState === 'playing') {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // Ghost progress linearly approaches 5 questions based on its recorded time
          const ghostCurrentQ = Math.min(
            5,
            (next / Math.max(1, activeOpponent.timeSeconds)) * 5
          );
          setGhostProgress(ghostCurrentQ);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [duelState, activeOpponent]);

  const startDuelWith = (opp: GhostOpponent) => {
    sound.playTap();
    setActiveOpponent(opp);
    const duelSet = getExerciseSet('mixed', 5);
    setQuestions(duelSet);
    setCurrentIndex(0);
    setAnswers([]);
    setElapsedSeconds(0);
    setGhostProgress(0);
    setDuelState('playing');
  };

  const handleStartFromCode = () => {
    if (!customDuelCode.trim()) return;

    // Decode or fallback to challenge
    const opp: GhostOpponent = {
      id: `custom-${Date.now()}`,
      name: 'Compañero Desafiante',
      avatar: '🎓',
      scoreOutOfTen: 8.0,
      timeSeconds: 50,
      difficulty: 'Media',
    };
    startDuelWith(opp);
  };

  const handleAnswerValidated = (result: AnswerValidationResult) => {
    setAnswers((prev) => [...prev, result]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Duel finished!
      setDuelState('result');

      const correctCount = answers.filter((a) => a.isCorrect).length;
      const myScore = (correctCount / 5) * 10;
      const won =
        myScore > activeOpponent.scoreOutOfTen ||
        (myScore === activeOpponent.scoreOutOfTen && elapsedSeconds < activeOpponent.timeSeconds);

      if (won) {
        sound.playVictory();
        recordDuelWin();
        addCoins(50);
        addXp(100);
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
        });
      } else {
        sound.playIncorrect();
      }

      // Generate a shareable duel code from this run
      const code = `ALGE-${Math.floor(1000 + Math.random() * 9000)}-${myScore * 10}`;
      setCreatedDuelCode(code);
    }
  };

  const copyDuelCode = () => {
    if (createdDuelCode) {
      navigator.clipboard?.writeText(
        `¡Te desafío a un Duelo de Álgebra en Algebrik! Mi código de duelo es: ${createdDuelCode}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Top Mode Selector Tabs Component
  const renderModeTabs = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex-wrap justify-center gap-1">
        <button
          onClick={() => {
            sound.playTap();
            setDuelMode('quick_online');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            duelMode === 'quick_online'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Duelo Rápido en Línea (2 Dispositivos)</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setDuelMode('quick_local');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            duelMode === 'quick_local'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Duelo Misma Pantalla (1 Dispositivo)</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setDuelMode('ghost');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
            duelMode === 'ghost'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>Duelo Fantasma Asíncrono</span>
        </button>
      </div>
    </div>
  );

  // If in quick_online or quick_local mode
  if (duelMode === 'quick_online') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
        {renderModeTabs()}
        <QuickDuelOnline />
      </div>
    );
  }

  if (duelMode === 'quick_local') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
        {renderModeTabs()}
        <QuickDuelLocalSplit />
      </div>
    );
  }

  // GHOST DUEL - 1. PLAYING DUEL
  if (duelState === 'playing' && questions[currentIndex]) {
    const currentEx = questions[currentIndex];
    const hasAnswered = answers.length > currentIndex;

    return (
      <div className="space-y-6 max-w-xl mx-auto animate-in fade-in">
        {renderModeTabs()}
        {/* Race Track HUD */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-indigo-400 flex items-center gap-1.5">
              <Swords className="w-4 h-4" />
              Duelo Asíncrono en Vivo
            </span>
            <span className="font-mono text-amber-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {elapsedSeconds}s
            </span>
          </div>

          {/* Player track */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CyberAvatar id={profile.avatarId} size="sm" />
                <span>Tú ({profile.name})</span>
              </span>
              <span className="font-mono text-indigo-400">
                Pregunta {currentIndex + 1} / 5
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300 shadow"
                style={{ width: `${((currentIndex + 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Ghost Opponent track */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <CyberAvatar id={activeOpponent.avatar} size="sm" />
                <span>Fantasma de {activeOpponent.name}</span>
              </span>
              <span className="font-mono text-rose-400">
                {Math.round(ghostProgress)} / 5
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-rose-500/80 rounded-full transition-all duration-500 shadow"
                style={{ width: `${Math.min(100, (ghostProgress / 5) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Current question card */}
        <ExerciseCard
          exercise={currentEx}
          onAnswerValidated={handleAnswerValidated}
          onNext={handleNext}
          showNextButton={hasAnswered}
          isDuelMode
        />
      </div>
    );
  }

  // 2. DUEL RESULT
  if (duelState === 'result') {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const myScore = (correctCount / 5) * 10;
    const isWinner =
      myScore > activeOpponent.scoreOutOfTen ||
      (myScore === activeOpponent.scoreOutOfTen && elapsedSeconds < activeOpponent.timeSeconds);

    return (
      <div className="max-w-lg mx-auto space-y-6 animate-in zoom-in-95">
        <div className="text-center p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="text-5xl mb-3">{isWinner ? '🏆' : '⚔️'}</div>

          <h2 className="text-2xl font-black text-white">
            {isWinner ? '¡Victoria en el Duelo!' : '¡Buen Intento en el Duelo!'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isWinner
              ? 'Has superado al rival en puntuación o velocidad. ¡Recompensa obtenida!'
              : 'El rival fantasma fue más rápido o certero. ¡Revancha ya!'}
          </p>

          {/* Versus Score Comparison */}
          <div className="grid grid-cols-2 gap-3 my-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-center p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex flex-col items-center">
              <CyberAvatar id={profile.avatarId} size="md" />
              <span className="text-[10px] uppercase font-bold text-indigo-300 block mt-2">
                Tú ({profile.name})
              </span>
              <div className="text-3xl font-black font-mono text-white mt-1">
                {myScore.toFixed(1)} <span className="text-xs text-slate-400">/ 10</span>
              </div>
              <span className="text-xs font-mono text-amber-300 block mt-1">
                {elapsedSeconds}s
              </span>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center">
              <CyberAvatar id={activeOpponent.avatar} size="md" />
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-2">
                {activeOpponent.name}
              </span>
              <div className="text-3xl font-black font-mono text-slate-300 mt-1">
                {activeOpponent.scoreOutOfTen.toFixed(1)}{' '}
                <span className="text-xs text-slate-500">/ 10</span>
              </div>
              <span className="text-xs font-mono text-slate-400 block mt-1">
                {activeOpponent.timeSeconds}s
              </span>
            </div>
          </div>

          {/* Share Duel Code */}
          {createdDuelCode && (
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                    Código de tu Duelo para Desafiar a un Amigo:
                  </span>
                  <span className="text-sm font-mono font-bold text-white tracking-wider">
                    {createdDuelCode}
                  </span>
                </div>
                <button
                  onClick={copyDuelCode}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setDuelState('lobby')}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition border border-slate-700"
            >
              Volver al Lobby de Duelos
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. DUEL LOBBY
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in">
      {renderModeTabs()}

      <div className="text-center">
        <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
          Multijugador Asíncrono
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
          Duelo Fantasma de Álgebra
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Compite contra la grabación fantasma de un compañero o desafía a los bots maestros.
          ¡5 preguntas rápidas al contrarreloj!
        </p>
      </div>

      {/* User Cyber Avatar Profile Card in Duel Lobby */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CyberAvatar id={profile.avatarId} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Tu Identidad Ciber-Matemática
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                {CYBER_AVATARS.find((a) => a.id === profile.avatarId)?.rarity || 'Legendario'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {CYBER_AVATARS.find((a) => a.id === profile.avatarId)?.name || 'Gauss Cyber-Príncipe'}
            </h3>
            <p className="text-xs text-slate-300 italic">
              {CYBER_AVATARS.find((a) => a.id === profile.avatarId)?.title || 'Arquitecto Polinomial'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAvatarSelector(true)}
          className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Cambiar Avatar Ciber</span>
        </button>
      </div>

      {/* Enter Friend's Duel Code */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Ingresar Código de Duelo de un Compañero</span>
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customDuelCode}
            onChange={(e) => setCustomDuelCode(e.target.value.toUpperCase())}
            placeholder="Ej: ALGE-4892-80"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleStartFromCode}
            disabled={!customDuelCode.trim()}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5"
          >
            <Swords className="w-4 h-4" />
            <span>Retar</span>
          </button>
        </div>
      </div>

      {/* Instant AI Rivals */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Rivales Fantasma Ciber-Matemáticos:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BOT_OPPONENTS.map((bot) => (
            <div
              key={bot.id}
              className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <CyberAvatar id={bot.avatar} size="md" />
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      bot.difficulty === 'Fácil'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : bot.difficulty === 'Media'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : bot.difficulty === 'Difícil'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    {bot.difficulty}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-1">{bot.name}</h4>
                <div className="text-[11px] text-slate-400 mt-1 space-y-0.5 font-mono">
                  <div>Nota: {bot.scoreOutOfTen.toFixed(1)}/10</div>
                  <div>Récord: {bot.timeSeconds}s</div>
                </div>
              </div>

              <button
                onClick={() => startDuelWith(bot)}
                className="mt-4 w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Desafiar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cyber Avatar Selector Modal */}
      <CyberAvatarSelectorModal
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
      />
    </div>
  );
};
