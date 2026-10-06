import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Swords,
  Users,
  Trophy,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Wifi,
  WifiOff,
  Copy,
  Check,
  Zap,
  Volume2,
  AlertCircle,
  Play,
  Share2,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Exercise } from '../../types/math';
import { CyberAvatar } from '../CyberAvatar';
import { sound } from '../../utils/audio';
import { MathKeyboard } from '../MathKeyboard';
import { VoiceInputButton } from '../VoiceInputButton';

interface PlayerState {
  id: string;
  name: string;
  avatarId: string;
  score: number;
}

export const QuickDuelOnline: React.FC<{ onBackToMenu?: () => void }> = ({ onBackToMenu }) => {
  const { profile, addCoins, addXp, recordDuelWin } = useGame();

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [gameState, setGameState] = useState<'lobby' | 'waiting_opponent' | 'playing' | 'round_winner' | 'match_over'>('lobby');

  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [players, setPlayers] = useState<PlayerState[]>([]);

  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(3);
  const [roundWinnerName, setRoundWinnerName] = useState<string | null>(null);
  const [roundCorrectAnswer, setRoundCorrectAnswer] = useState<string | null>(null);
  const [matchWinnerId, setMatchWinnerId] = useState<string | null>(null);

  const [myAnswer, setMyAnswer] = useState('');
  const [opponentTypingLength, setOpponentTypingLength] = useState(0);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Connect to WebSocket
  const connectWebSocket = (): WebSocket => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/quick-duel`;
    const ws = new WebSocket(wsUrl);

    setConnectionStatus('connecting');

    ws.onopen = () => {
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleServerMessage(msg);
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };

    ws.onerror = (err) => {
      console.warn('WS error:', err);
      setConnectionStatus('disconnected');
    };

    wsRef.current = ws;
    return ws;
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleServerMessage = (msg: any) => {
    switch (msg.type) {
      case 'room_joined':
        setRoomCode(msg.code);
        setMyPlayerId(msg.playerId);
        setPlayers(msg.players || []);
        if (msg.playerCount < 2) {
          setGameState('waiting_opponent');
        }
        break;

      case 'game_start':
        sound.playVictory();
        setPlayers(msg.players);
        setCurrentExercise(msg.currentExercise);
        setRound(msg.round || 1);
        setMaxRounds(msg.maxRounds || 3);
        setMyAnswer('');
        setErrorFeedback(null);
        setGameState('playing');
        break;

      case 'opponent_typing':
        setOpponentTypingLength(msg.inputLength || 0);
        break;

      case 'round_ended':
        sound.playVictory();
        setRoundWinnerName(msg.winnerName);
        setRoundCorrectAnswer(msg.correctAnswer);
        setGameState('round_winner');

        // Update scores
        if (msg.scores) {
          setPlayers((prev) =>
            prev.map((p) => ({
              ...p,
              score: msg.scores[p.id] ?? p.score,
            }))
          );
        }

        if (msg.isMatchWon) {
          setMatchWinnerId(msg.winnerId);
          setTimeout(() => {
            setGameState('match_over');
            if (msg.winnerId === myPlayerId) {
              sound.playVictory();
              confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
              recordDuelWin();
              addCoins(50);
              addXp(100);
            }
          }, 2000);
        }
        break;

      case 'next_round':
        setRound(msg.round);
        setCurrentExercise(msg.currentExercise);
        setMyAnswer('');
        setErrorFeedback(null);
        setOpponentTypingLength(0);
        setGameState('playing');
        break;

      case 'answer_wrong':
        sound.playIncorrect();
        setErrorFeedback(msg.message || 'Respuesta incorrecta. ¡Continúa!');
        setTimeout(() => setErrorFeedback(null), 2500);
        break;

      case 'opponent_left':
        setErrorFeedback('Tu oponente se ha desconectado.');
        setGameState('waiting_opponent');
        break;

      case 'error':
        setErrorFeedback(msg.message);
        break;
    }
  };

  const handleCreateRoom = () => {
    sound.playTap();
    const ws = connectWebSocket();
    const sendJoin = () => {
      ws.send(
        JSON.stringify({
          type: 'join',
          name: profile.name,
          avatarId: profile.avatarId,
        })
      );
    };
    if (ws.readyState === WebSocket.OPEN) {
      sendJoin();
    } else {
      ws.onopen = sendJoin;
    }
  };

  const handleJoinByCode = () => {
    if (!inputCode.trim()) return;
    sound.playTap();
    const ws = connectWebSocket();
    const sendJoin = () => {
      ws.send(
        JSON.stringify({
          type: 'join',
          code: inputCode.trim(),
          name: profile.name,
          avatarId: profile.avatarId,
        })
      );
    };
    if (ws.readyState === WebSocket.OPEN) {
      sendJoin();
    } else {
      ws.onopen = sendJoin;
    }
  };

  const handleQuickMatch = () => {
    sound.playTap();
    const ws = connectWebSocket();
    const sendMatch = () => {
      ws.send(
        JSON.stringify({
          type: 'quick_match',
          name: profile.name,
          avatarId: profile.avatarId,
        })
      );
    };
    if (ws.readyState === WebSocket.OPEN) {
      sendMatch();
    } else {
      ws.onopen = sendMatch;
    }
  };

  const handleAnswerChange = (val: string) => {
    setMyAnswer(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'input_typing',
          inputLength: val.length,
        })
      );
    }
  };

  const handleSubmitAnswer = () => {
    if (!myAnswer.trim() || !wsRef.current) return;
    sound.playTap();
    wsRef.current.send(
      JSON.stringify({
        type: 'submit_answer',
        answer: myAnswer.trim(),
      })
    );
  };

  const handleRematch = () => {
    if (!wsRef.current) return;
    sound.playTap();
    wsRef.current.send(
      JSON.stringify({
        type: 'rematch',
      })
    );
  };

  const copyCode = () => {
    if (roomCode) {
      navigator.clipboard?.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const myPlayer = players.find((p) => p.id === myPlayerId) || {
    id: 'me',
    name: profile.name,
    avatarId: profile.avatarId,
    score: 0,
  };

  const opponentPlayer = players.find((p) => p.id !== myPlayerId) || {
    id: 'opp',
    name: 'Esperando rival...',
    avatarId: 'cyber_valkyrie',
    score: 0,
  };

  // 1. LOBBY VIEW
  if (gameState === 'lobby') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Multijugador en Tiempo Real (WebSocket)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Duelo Rápido en Línea
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Dos jugadores conectados resuelven el <strong>mismo problema simultáneamente</strong>. ¡El primero en enviar la respuesta correcta gana la ronda!
          </p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quick Matchmaking */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white">Partida Rápida</h3>
              <p className="text-xs text-slate-400 mt-1">
                Conéctate al instante con cualquier compañero en línea en busca de un desafío.
              </p>
            </div>
            <button
              onClick={handleQuickMatch}
              className="mt-6 w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Buscar Oponente Ahora</span>
            </button>
          </div>

          {/* Create Private Room */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Crear Sala Privada</h3>
              <p className="text-xs text-slate-400 mt-1">
                Genera un código de sala para compartir con un amigo o compañero de clase.
              </p>
            </div>
            <button
              onClick={handleCreateRoom}
              className="mt-6 w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Crear Sala de Duelo</span>
            </button>
          </div>
        </div>

        {/* Join by Code Box */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            O unirse con código de sala:
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Ej: QD-8492"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleJoinByCode}
              disabled={!inputCode.trim()}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. WAITING FOR OPPONENT VIEW
  if (gameState === 'waiting_opponent') {
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 animate-pulse">
          <Users className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">Esperando a tu Oponente...</h3>
          <p className="text-xs text-slate-400 mt-1">
            Comparte este código con tu contrincante para que se una a la pantalla dividida.
          </p>
        </div>

        {/* Room Code Card */}
        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-300 block">Código de la Sala:</span>
            <span className="text-2xl font-mono font-black text-white tracking-widest">{roomCode}</span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition active:scale-95"
          >
            {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (wsRef.current) wsRef.current.close();
            setGameState('lobby');
          }}
          className="text-xs text-slate-400 hover:text-white underline"
        >
          Cancelar y volver al menú
        </button>
      </div>
    );
  }

  // 3. MATCH OVER RESULT VIEW
  if (gameState === 'match_over') {
    const isWinner = matchWinnerId === myPlayerId;
    return (
      <div className="max-w-md mx-auto text-center p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95">
        <div className="text-6xl">{isWinner ? '🏆' : '⚔️'}</div>
        <div>
          <h2 className="text-2xl font-black text-white">
            {isWinner ? '¡Victoria en el Duelo Rápido!' : '¡Buen Combate!'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isWinner
              ? 'Has demostrado gran velocidad de cálculo y precisión algebraica.'
              : 'Tu oponente logró responder primero. ¡Pide la revancha ahora!'}
          </p>
        </div>

        {/* Versus Final Scoreboard */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-center">
            <CyberAvatar id={myPlayer.avatarId} size="md" className="mx-auto" />
            <span className="text-xs font-bold text-white block mt-2">{myPlayer.name} (Tú)</span>
            <span className="text-2xl font-black font-mono text-indigo-300">{myPlayer.score} pts</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
            <CyberAvatar id={opponentPlayer.avatarId} size="md" className="mx-auto" />
            <span className="text-xs font-bold text-slate-300 block mt-2">{opponentPlayer.name}</span>
            <span className="text-2xl font-black font-mono text-slate-400">{opponentPlayer.score} pts</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRematch}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
          >
            Revancha Inmediata
          </button>
          <button
            onClick={() => setGameState('lobby')}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Salir al Lobby
          </button>
        </div>
      </div>
    );
  }

  // 4. ACTIVE GAMEPLAY: REAL-TIME SPLIT SCREEN
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-in fade-in">
      {/* Central Duel HUD: Match Status, Round, Shared Problem */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" />
              <span>Duelo en Vivo · Ronda {round} de {maxRounds}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Sala: {roomCode}</span>
          </div>

          <div className="flex items-center gap-3 font-mono font-bold">
            <span className="text-indigo-400">{myPlayer.name}: {myPlayer.score}</span>
            <span className="text-slate-600">vs</span>
            <span className="text-rose-400">{opponentPlayer.name}: {opponentPlayer.score}</span>
          </div>
        </div>

        {/* Central Identical Algebra Problem */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/40 to-slate-950 border border-indigo-500/40 text-center shadow-inner">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            {currentExercise?.prompt || 'Resuelve el problema algebraico:'}
          </span>
          <span className="font-mono text-2xl sm:text-4xl font-extrabold text-white tracking-wide">
            {currentExercise?.displayExpression}
          </span>
        </div>

        {/* Round Winner Overlay / Flash message */}
        {gameState === 'round_winner' && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center animate-in zoom-in-95">
            <span className="text-sm font-bold text-emerald-300 block">
              ¡{roundWinnerName} respondió primero! (+1 punto)
            </span>
            <span className="text-xs text-slate-300">
              Respuesta: <strong className="font-mono text-white">{roundCorrectAnswer}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Real-Time Split Screen: Player 1 (You) vs Player 2 (Opponent) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: You (Player 1) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CyberAvatar id={myPlayer.avatarId} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-white">{myPlayer.name} (Tú)</h4>
                  <span className="text-[11px] text-indigo-400 font-bold">Puntaje: {myPlayer.score}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Tu Panel
              </span>
            </div>

            {/* Answer Input */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={myAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitAnswer();
                  }}
                  disabled={gameState === 'round_winner'}
                  placeholder="Tu respuesta (ej: x^2 + 6x + 9)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <VoiceInputButton
                    onTranscriptReady={(txt) => handleAnswerChange(txt)}
                    disabled={gameState === 'round_winner'}
                  />
                </div>
              </div>

              {errorFeedback && (
                <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorFeedback}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  {showKeyboard ? 'Ocultar teclado' : 'Teclado matemático'}
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={!myAnswer.trim() || gameState === 'round_winner'}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
                >
                  <span>Enviar Primero</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Math Keyboard */}
              {showKeyboard && gameState !== 'round_winner' && (
                <div className="mt-2 animate-in fade-in">
                  <MathKeyboard
                    onInsert={(c) => handleAnswerChange(myAnswer + c)}
                    onBackspace={() => handleAnswerChange(myAnswer.slice(0, -1))}
                    onClear={() => handleAnswerChange('')}
                    onSubmit={handleSubmitAnswer}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Opponent (Player 2) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CyberAvatar id={opponentPlayer.avatarId} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{opponentPlayer.name}</h4>
                  <span className="text-[11px] text-rose-400 font-bold">Puntaje: {opponentPlayer.score}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>En vivo</span>
              </span>
            </div>

            {/* Opponent Live Status / Ghost progress simulator */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estado del Rival:</span>
                <span className="font-mono text-indigo-300 font-bold">
                  {opponentTypingLength > 0 ? 'Escribiendo respuesta...' : 'Analizando problema...'}
                </span>
              </div>

              {/* Live typing character bars */}
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, opponentTypingLength * 8)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 italic text-center">
                ¡Date prisa! Tu rival está tecleando su resultado en tiempo real.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <span className="text-[11px] text-slate-500">
              Primer jugador en responder con exactitud se lleva la ronda.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
