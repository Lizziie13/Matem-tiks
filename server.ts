import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { generateDynamicExercise } from './src/utils/mathQuestions';
import { validateMathAnswer } from './src/utils/mathEngine';
import { TopicId } from './src/types/math';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

/**
 * POST /api/adaptive-path
 * Analyzes student performance and generates an AI-curated adaptive learning path
 * using gemini-3.8-flash, with automatic algorithmic fallback.
 */
app.post('/api/adaptive-path', async (req, res) => {
  try {
    const {
      studentName,
      studentParalelo,
      topicProgress = {},
      streakDays = 1,
      level = 1,
    } = req.body;

    // Identify weak or untested topics
    const topicStats = Object.entries(topicProgress).map(([topicId, prog]: [string, any]) => ({
      topicId,
      accuracy: prog.accuracy || 0,
      completed: prog.exercisesCompleted || 0,
      correct: prog.correctCount || 0,
    }));

    // If Gemini client is active, request AI recommendations & exercises
    if (aiClient) {
      try {
        const prompt = `Actúa como un profesor experto y pedagogo de matemáticas de secundaria y bachillerato especializado en Productos Notables y Factorización en español.
El estudiante se llama "${studentName || 'Estudiante'}" (Paralelo: "${studentParalelo || 'A'}"), Nivel actual: ${level}, Racha: ${streakDays} días.

Estadísticas actuales de dominio del estudiante por tema:
${JSON.stringify(topicStats, null, 2)}

Temas posibles de la materia:
1. binomio-cuadrado (Binomio al Cuadrado: (a ± b)²)
2. diferencia-cuadrados (Binomios Conjugados / Dif. de Cuadrados: (a+b)(a-b) = a² - b²)
3. binomio-termino-comun (Binomios con Término Común: (x+a)(x+b))
4. factor-comun (Factor Común Monomio y Polinomio: ab + ac = a(b+c))
5. trinomio-simple (Trinomio de la forma x² + bx + c)
6. trinomio-compuesto (Trinomio de la forma ax² + bx + c)
7. cubos-notables (Cubos Notables: binomio al cubo y suma/dif de cubos)

Tu misión:
1. Realizar un diagnóstico pedagógico cálido, empático y constructivo (máximo 3 párrafos cortos) en español señalando sus fortalezas y detectando específicamente los temas con menor efectividad o donde necesita reforzar.
2. Determinar el nivel de dificultad adaptativo inicial adecuado (1 = Básico/Refuerzo guiado, 2 = Intermedio, 3 = Avanzado/Desafío).
3. Recomendar el orden prioritario de temas a reforzar.
4. Proporcionar 3 consejos clave o trucos mnemotécnicos específicos para los temas donde tiene dificultad.
5. Generar 4 ejercicios matemáticos adaptativos personalizados diseñados para superar sus errores más comunes (por ejemplo, manejo de signos negativos en binomios o factores de trinomios).

Responde ÚNICAMENTE en formato JSON con la siguiente estructura exacta:
{
  "diagnosticSummary": "string con el diagnóstico pedagógico",
  "recommendedTopicIds": ["id-del-tema-prioritario", "segundo-tema"],
  "recommendedDifficulty": 1,
  "difficultyReason": "string explicando por qué se eligió esta dificultad",
  "smartTips": ["consejo 1", "consejo 2", "consejo 3"],
  "exercises": [
    {
      "id": "ai-ex-1",
      "topicId": "binomio-cuadrado",
      "type": "expand",
      "level": 1,
      "prompt": "Desarrolla el siguiente binomio al cuadrado:",
      "expression": "(x + 4)^2",
      "displayExpression": "(x + 4)²",
      "acceptableAnswers": ["x^2+8x+16", "x²+8x+16"],
      "correctAnswerFormatted": "x² + 8x + 16",
      "stepByStep": [
        "1. Cuadrado del primero: (x)² = x²",
        "2. Doble producto: 2 · (x) · (4) = 8x",
        "3. Cuadrado del segundo: (4)² = 16",
        "Resultado: x² + 8x + 16"
      ],
      "hint": "Aplica (a+b)² = a² + 2ab + b²"
    }
  ]
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            success: true,
            source: 'gemini-3.8-flash',
            ...parsed,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to algorithmic engine:', geminiError?.message || geminiError);
      }
    }

    // Fallback: Algorithmic adaptive path computation
    // Determine weakest topics
    const weakList = topicStats
      .filter((s) => s.completed > 0 && s.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy);

    const targetTopicId = weakList.length > 0 ? weakList[0].topicId : 'binomio-cuadrado';
    const suggestedLevel = weakList.length > 0 && weakList[0].accuracy < 50 ? 1 : 2;

    return res.json({
      success: true,
      source: 'algorithmic-fallback',
      diagnosticSummary: weakList.length > 0
        ? `¡Hola ${studentName || 'estudiante'}! El sistema adaptativo ha detectado que necesitas reforzar especialmente tus habilidades en "${targetTopicId.replace('-', ' ')}", donde tu efectividad actual es de ${weakList[0].accuracy}%. Hemos calibrado la dificultad a Nivel ${suggestedLevel} para consolidar tus bases paso a paso con retroalimentación inmediata.`
        : `¡Excelente trabajo ${studentName || 'estudiante'}! Tu desempeño general es sólido. La ruta adaptativa te asignará ejercicios balanceados de dificultad progresiva (Nivel ${suggestedLevel}) para afianzar productos notables y factorización rápida.`,
      recommendedTopicIds: weakList.length > 0 ? weakList.map((w) => w.topicId) : ['binomio-cuadrado', 'diferencia-cuadrados'],
      recommendedDifficulty: suggestedLevel,
      difficultyReason: weakList.length > 0
        ? `Calibrado a Nivel ${suggestedLevel} para reforzar conceptos con menor porcentaje de aciertos.`
        : 'Calibrado a Nivel 2 (Intermedio) para mantener fluidez y agilidad mental.',
      smartTips: [
        'En (a - b)², el término medio siempre es negativo (-2ab), pero el último siempre es positivo (+b²).',
        'En binomios conjugados (a + b)(a - b), los términos medios se anulan: el resultado es solo a² - b².',
        'Al factorizar trinomios x² + bx + c, busca primero los factores del término independiente c.',
      ],
      exercises: [], // Client will generate procedural exercises for target topics
    });
  } catch (error: any) {
    console.error('Error generating adaptive learning path:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error en el servidor',
    });
  }
});

// In-memory ledger of synced student attempts from offline clients
const syncedAttemptsStore: any[] = [];

/**
 * POST /api/sync-offline-attempts
 * Receives queued exercise attempts performed offline by students and logs them.
 */
app.post('/api/sync-offline-attempts', (req, res) => {
  try {
    const { attempts = [], clientTimestamp } = req.body;

    if (!Array.isArray(attempts)) {
      return res.status(400).json({ success: false, error: 'attempts array required' });
    }

    const serverReceivedAt = Date.now();
    for (const att of attempts) {
      syncedAttemptsStore.push({
        ...att,
        serverReceivedAt,
      });
    }

    console.log(
      `[Sync Engine] Successfully synced ${attempts.length} offline attempts at ${new Date().toISOString()}`
    );

    return res.json({
      success: true,
      processedCount: attempts.length,
      serverReceivedAt,
      totalStoredOnServer: syncedAttemptsStore.length,
    });
  } catch (error: any) {
    console.error('Error processing offline attempts sync:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error en sincronización',
    });
  }
});

/**
 * GET /api/sync-stats
 * Returns overall server sync ledger statistics
 */
app.get('/api/sync-stats', (_req, res) => {
  res.json({
    totalSyncedAttempts: syncedAttemptsStore.length,
    lastAttempt: syncedAttemptsStore[syncedAttemptsStore.length - 1] || null,
  });
});

// --- Quick Duel Real-Time WebSocket Engine ---
interface QuickDuelPlayer {
  id: string;
  name: string;
  avatarId: string;
  score: number;
  ws: WebSocket;
}

interface QuickDuelRoom {
  code: string;
  players: QuickDuelPlayer[];
  currentExercise: any | null;
  round: number;
  maxRounds: number;
  status: 'waiting' | 'in_round' | 'round_winner' | 'match_over';
  roundWinnerId?: string;
  roundWinnerName?: string;
  roundStartTime?: number;
}

const quickDuelRooms = new Map<string, QuickDuelRoom>();

const DUEL_TOPICS: TopicId[] = [
  'binomio-cuadrado',
  'diferencia-cuadrados',
  'binomio-termino-comun',
  'trinomio-simple',
  'factor-comun',
];

function getRandomDuelExercise() {
  const tid = DUEL_TOPICS[Math.floor(Math.random() * DUEL_TOPICS.length)];
  return generateDynamicExercise(tid, 2);
}

const wss = new WebSocketServer({ server, path: '/ws/quick-duel' });

wss.on('connection', (ws: WebSocket) => {
  let playerRoomCode: string | null = null;
  let playerId: string | null = null;

  ws.on('message', (messageRaw: string) => {
    try {
      const data = JSON.parse(messageRaw.toString());

      if (data.type === 'join' || data.type === 'quick_match') {
        let room: QuickDuelRoom | undefined;

        if (data.type === 'quick_match') {
          // Find any waiting room with 1 player
          for (const r of quickDuelRooms.values()) {
            if (r.status === 'waiting' && r.players.length === 1) {
              room = r;
              break;
            }
          }
        } else if (data.code) {
          room = quickDuelRooms.get(data.code.toUpperCase());
        }

        if (!room) {
          // Create new room
          const code = data.code ? data.code.toUpperCase() : `QD-${Math.floor(1000 + Math.random() * 9000)}`;
          room = {
            code,
            players: [],
            currentExercise: null,
            round: 0,
            maxRounds: 3,
            status: 'waiting',
          };
          quickDuelRooms.set(code, room);
        }

        if (room.players.length >= 2) {
          ws.send(JSON.stringify({ type: 'error', message: 'La sala de duelo ya está completa (2/2 jugadores).' }));
          return;
        }

        playerId = `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        playerRoomCode = room.code;

        const player: QuickDuelPlayer = {
          id: playerId,
          name: data.name || 'Matemático Anónimo',
          avatarId: data.avatarId || 'cyber_gauss',
          score: 0,
          ws,
        };

        room.players.push(player);

        // Tell player they joined room
        ws.send(
          JSON.stringify({
            type: 'room_joined',
            code: room.code,
            playerId,
            playerCount: room.players.length,
            players: room.players.map((p) => ({ id: p.id, name: p.name, avatarId: p.avatarId, score: p.score })),
          })
        );

        // If 2 players, start game!
        if (room.players.length === 2) {
          room.currentExercise = getRandomDuelExercise();
          room.round = 1;
          room.status = 'in_round';
          room.roundStartTime = Date.now();

          const payload = {
            type: 'game_start',
            code: room.code,
            round: 1,
            maxRounds: room.maxRounds,
            players: room.players.map((p) => ({ id: p.id, name: p.name, avatarId: p.avatarId, score: p.score })),
            currentExercise: room.currentExercise,
          };

          for (const p of room.players) {
            p.score = 0;
            p.ws.send(JSON.stringify(payload));
          }
        }
      } else if (data.type === 'input_typing' && playerRoomCode) {
        const room = quickDuelRooms.get(playerRoomCode);
        if (room) {
          for (const p of room.players) {
            if (p.id !== playerId) {
              p.ws.send(
                JSON.stringify({
                  type: 'opponent_typing',
                  playerId,
                  inputLength: data.inputLength || 0,
                })
              );
            }
          }
        }
      } else if (data.type === 'submit_answer' && playerRoomCode) {
        const room = quickDuelRooms.get(playerRoomCode);
        if (!room || room.status !== 'in_round' || !room.currentExercise) return;

        const player = room.players.find((p) => p.id === playerId);
        if (!player) return;

        const validation = validateMathAnswer(data.answer, room.currentExercise);

        if (validation.isCorrect) {
          room.status = 'round_winner';
          player.score += 1;
          const isMatchWon = player.score >= room.maxRounds;

          const roundEndPayload = {
            type: 'round_ended',
            winnerId: player.id,
            winnerName: player.name,
            correctAnswer: room.currentExercise.correctAnswerFormatted,
            scores: room.players.reduce((acc, p) => ({ ...acc, [p.id]: p.score }), {}),
            isMatchWon,
          };

          for (const p of room.players) {
            p.ws.send(JSON.stringify(roundEndPayload));
          }

          if (isMatchWon) {
            room.status = 'match_over';
          } else {
            // Next round after 2.5 seconds
            setTimeout(() => {
              if (room && room.status === 'round_winner') {
                room.round += 1;
                room.currentExercise = getRandomDuelExercise();
                room.status = 'in_round';
                room.roundStartTime = Date.now();

                const nextRoundPayload = {
                  type: 'next_round',
                  round: room.round,
                  currentExercise: room.currentExercise,
                };

                for (const p of room.players) {
                  p.ws.send(JSON.stringify(nextRoundPayload));
                }
              }
            }, 2500);
          }
        } else {
          // Send wrong feedback to this player
          ws.send(
            JSON.stringify({
              type: 'answer_wrong',
              message: 'Respuesta incorrecta. ¡Continúa intentando!',
            })
          );
        }
      } else if (data.type === 'rematch' && playerRoomCode) {
        const room = quickDuelRooms.get(playerRoomCode);
        if (room && room.players.length === 2) {
          for (const p of room.players) p.score = 0;
          room.round = 1;
          room.currentExercise = getRandomDuelExercise();
          room.status = 'in_round';

          const restartPayload = {
            type: 'game_start',
            code: room.code,
            round: 1,
            maxRounds: room.maxRounds,
            players: room.players.map((p) => ({ id: p.id, name: p.name, avatarId: p.avatarId, score: p.score })),
            currentExercise: room.currentExercise,
          };

          for (const p of room.players) {
            p.ws.send(JSON.stringify(restartPayload));
          }
        }
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    if (playerRoomCode) {
      const room = quickDuelRooms.get(playerRoomCode);
      if (room) {
        room.players = room.players.filter((p) => p.id !== playerId);
        for (const p of room.players) {
          p.ws.send(
            JSON.stringify({
              type: 'opponent_left',
              message: 'Tu oponente se ha desconectado de la sala.',
            })
          );
        }
        if (room.players.length === 0) {
          quickDuelRooms.delete(playerRoomCode);
        }
      }
    }
  });
});

// Setup Vite in development or static serve in production
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Algebrik Server running on http://0.0.0.0:${PORT}`);
});
