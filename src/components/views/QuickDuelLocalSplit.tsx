import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Swords,
  Users,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Exercise, TopicId } from '../../types/math';
import { generateDynamicExercise } from '../../utils/mathQuestions';
import { validateMathAnswer } from '../../utils/mathEngine';
import { CyberAvatar } from '../CyberAvatar';
import { sound } from '../../utils/audio';

const DUEL_TOPICS: TopicId[] = [
  'binomio-cuadrado',
  'diferencia-cuadrados',
  'binomio-termino-comun',
  'trinomio-simple',
  'factor-comun',
];

export const QuickDuelLocalSplit: React.FC = () => {
  const { profile, addCoins, addXp, recordDuelWin } = useGame();

  const [p1Name, setP1Name] = useState(profile.name || 'Jugador 1');
  const [p2Name, setP2Name] = useState('Jugador 2');
  const [p1Avatar, setP1Avatar] = useState(profile.avatarId || 'cyber_gauss');
  const [p2Avatar, setP2Avatar] = useState('cyber_lovelace');

  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(3);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const [currentExercise, setCurrentExercise] = useState<Exercise>(() =>
    generateDynamicExercise(DUEL_TOPICS[0], 2)
  );

  const [p1Input, setP1Input] = useState('');
  const [p2Input, setP2Input] = useState('');
  const [p1Error, setP1Error] = useState(false);
  const [p2Error, setP2Error] = useState(false);

  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [matchWinner, setMatchWinner] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const startMatch = () => {
    sound.playTap();
    setRound(1);
    setP1Score(0);
    setP2Score(0);
    setP1Input('');
    setP2Input('');
    setP1Error(false);
    setP2Error(false);
    setRoundWinner(null);
    setMatchWinner(null);
    const nextEx = generateDynamicExercise(
      DUEL_TOPICS[Math.floor(Math.random() * DUEL_TOPICS.length)],
      2
    );
    setCurrentExercise(nextEx);
    setIsPlaying(true);
  };

  const handleP1Submit = () => {
    if (!p1Input.trim() || roundWinner || matchWinner) return;
    const result = validateMathAnswer(p1Input, currentExercise);
    if (result.isCorrect) {
      sound.playVictory();
      const newScore = p1Score + 1;
      setP1Score(newScore);
      setRoundWinner(p1Name);

      if (newScore >= maxRounds) {
        setMatchWinner(p1Name);
        sound.playVictory();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        recordDuelWin();
        addCoins(50);
        addXp(100);
      } else {
        setTimeout(nextRound, 2000);
      }
    } else {
      sound.playIncorrect();
      setP1Error(true);
      setTimeout(() => setP1Error(false), 2000);
    }
  };

  const handleP2Submit = () => {
    if (!p2Input.trim() || roundWinner || matchWinner) return;
    const result = validateMathAnswer(p2Input, currentExercise);
    if (result.isCorrect) {
      sound.playVictory();
      const newScore = p2Score + 1;
      setP2Score(newScore);
      setRoundWinner(p2Name);

      if (newScore >= maxRounds) {
        setMatchWinner(p2Name);
        sound.playVictory();
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } else {
        setTimeout(nextRound, 2000);
      }
    } else {
      sound.playIncorrect();
      setP2Error(true);
      setTimeout(() => setP2Error(false), 2000);
    }
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    setP1Input('');
    setP2Input('');
    setP1Error(false);
    setP2Error(false);
    setRoundWinner(null);
    const nextEx = generateDynamicExercise(
      DUEL_TOPICS[Math.floor(Math.random() * DUEL_TOPICS.length)],
      2
    );
    setCurrentExercise(nextEx);
  };

  if (!isPlaying) {
    return (
      <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
          <Users className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Duelo Rápido en la Misma Pantalla</h3>
          <p className="text-xs text-slate-400 mt-1">
            Dos compañeros en el mismo celular o tableta compiten en pantalla dividida por ver quién responde primero.
          </p>
        </div>

        {/* Player Setup */}
        <div className="space-y-4 text-left text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Nombre Jugador 1 (Azul):</label>
            <input
              type="text"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Nombre Jugador 2 (Rojo):</label>
            <input
              type="text"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-bold"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">Puntos para Ganar:</label>
            <div className="flex gap-2">
              {[3, 5].map((pts) => (
                <button
                  key={pts}
                  onClick={() => setMaxRounds(pts)}
                  className={`flex-1 py-2 rounded-xl font-bold border transition ${
                    maxRounds === pts
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Primero a {pts} puntos
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={startMatch}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" />
          <span>¡Comenzar Duelo en Pantalla Dividida!</span>
        </button>
      </div>
    );
  }

  // MATCH FINISHED
  if (matchWinner) {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="text-6xl">🏆</div>
        <div>
          <h2 className="text-2xl font-black text-white">¡{matchWinner} es el Campeón!</h2>
          <p className="text-xs text-slate-400 mt-1">
            Victoria total en el duelo rápido de pantalla dividida.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center">
            <span className="text-xs font-bold text-indigo-300 block">{p1Name}</span>
            <span className="text-3xl font-black font-mono text-white mt-1">{p1Score}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-center">
            <span className="text-xs font-bold text-rose-300 block">{p2Name}</span>
            <span className="text-3xl font-black font-mono text-white mt-1">{p2Score}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startMatch}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
          >
            Revancha
          </button>
          <button
            onClick={() => setIsPlaying(false)}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Configurar
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE MATCH PLAYING
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in">
      {/* Central Split-Screen Match Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
        <div className="flex items-center justify-between text-xs font-bold mb-3">
          <span className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Ronda {round} · Primero a {maxRounds}
          </span>

          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-indigo-400 font-bold">{p1Name}: {p1Score}</span>
            <span className="text-slate-600">vs</span>
            <span className="text-rose-400 font-bold">{p2Name}: {p2Score}</span>
          </div>
        </div>

        {/* Shared Algebra Problem */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 shadow-inner">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            {currentExercise.prompt}
          </span>
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
            {currentExercise.displayExpression}
          </span>
        </div>

        {/* Round Winner Banner */}
        {roundWinner && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 animate-in zoom-in-95">
            <span className="text-sm font-bold text-emerald-300 block">
              ¡{roundWinner} respondió primero correctamente! (+1 punto)
            </span>
            <span className="text-xs text-slate-300">
              Respuesta: <strong className="font-mono text-white">{currentExercise.correctAnswerFormatted}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Split Screen 2-Player Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 (Blue) */}
        <div className="p-5 rounded-3xl bg-slate-900 border-2 border-indigo-500/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CyberAvatar id={p1Avatar} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-white">{p1Name}</h4>
                  <span className="text-xs text-indigo-400 font-mono font-bold">Puntos: {p1Score}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Jugador 1
              </span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={p1Input}
                onChange={(e) => setP1Input(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleP1Submit();
                }}
                disabled={Boolean(roundWinner)}
                placeholder="Escribe tu resultado aquí"
                className={`w-full px-4 py-3 rounded-2xl bg-slate-800 border text-white font-mono text-sm focus:outline-none focus:ring-2 transition ${
                  p1Error
                    ? 'border-rose-500 ring-rose-500/30 bg-rose-950/20'
                    : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/30'
                }`}
              />

              {p1Error && <span className="text-xs text-rose-400 font-semibold block">¡Incorrecto! Prueba otra vez.</span>}

              {/* Quick Math Character Inserts */}
              <div className="flex gap-1.5 flex-wrap">
                {['²', 'x', '+', '-', '(', ')'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setP1Input((prev) => prev + c)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                onClick={handleP1Submit}
                disabled={!p1Input.trim() || Boolean(roundWinner)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>¡Responder Primero!</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Player 2 (Red) */}
        <div className="p-5 rounded-3xl bg-slate-900 border-2 border-rose-500/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CyberAvatar id={p2Avatar} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-white">{p2Name}</h4>
                  <span className="text-xs text-rose-400 font-mono font-bold">Puntos: {p2Score}</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Jugador 2
              </span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={p2Input}
                onChange={(e) => setP2Input(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleP2Submit();
                }}
                disabled={Boolean(roundWinner)}
                placeholder="Escribe tu resultado aquí"
                className={`w-full px-4 py-3 rounded-2xl bg-slate-800 border text-white font-mono text-sm focus:outline-none focus:ring-2 transition ${
                  p2Error
                    ? 'border-rose-500 ring-rose-500/30 bg-rose-950/20'
                    : 'border-slate-700 focus:border-rose-500 focus:ring-rose-500/30'
                }`}
              />

              {p2Error && <span className="text-xs text-rose-400 font-semibold block">¡Incorrecto! Prueba otra vez.</span>}

              {/* Quick Math Character Inserts */}
              <div className="flex gap-1.5 flex-wrap">
                {['²', 'x', '+', '-', '(', ')'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setP2Input((prev) => prev + c)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold"
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                onClick={handleP2Submit}
                disabled={!p2Input.trim() || Boolean(roundWinner)}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>¡Responder Primero!</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
