import React, { useState } from 'react';
import { Mic, MicOff, Volume2, HelpCircle, X, Check } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { sound } from '../utils/audio';

interface VoiceInputButtonProps {
  onTranscriptReady: (mathExpr: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscriptReady,
  disabled = false,
}) => {
  const {
    isListening,
    transcript,
    parsedMath,
    error,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const [showVoiceHelp, setShowVoiceHelp] = useState(false);

  const toggleListening = () => {
    sound.playTap();
    if (isListening) {
      stopListening();
      if (parsedMath) {
        onTranscriptReady(parsedMath);
      }
    } else {
      startListening();
    }
  };

  const handleApplySpoken = () => {
    stopListening();
    if (parsedMath) {
      onTranscriptReady(parsedMath);
    }
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={toggleListening}
          disabled={disabled || !isSupported}
          className={`relative flex items-center justify-center p-3 rounded-2xl font-bold transition-all duration-300 active:scale-95 shadow-lg ${
            !isSupported
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              : isListening
              ? 'bg-rose-500 text-white shadow-rose-500/50 ring-4 ring-rose-500/30 animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 border border-indigo-400/30'
          }`}
          title={isListening ? 'Detener dictado por voz' : 'Responder por voz en español'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5 animate-bounce" />
          ) : (
            <Mic className="w-5 h-5" />
          )}

          {/* Glowing pulse rings when listening */}
          {isListening && (
            <span className="absolute -inset-1 rounded-2xl bg-rose-500/30 animate-ping pointer-events-none" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowVoiceHelp(true)}
          className="ml-1 text-slate-400 hover:text-slate-200 p-1"
          title="¿Cómo dictar fórmulas con la voz?"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating live voice indicator modal or popup when listening */}
      {isListening && (
        <div className="fixed inset-x-4 top-20 max-w-md mx-auto z-50 p-4 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Escuchando tu voz...
              </span>
            </div>
            <button
              onClick={stopListening}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3">
            <p className="text-xs text-slate-400">Texto detectado:</p>
            <p className="text-sm font-medium text-slate-200 italic mt-0.5 min-h-[22px]">
              "{transcript || 'Habla ahora (ej: equis al cuadrado más cuatro)...'}"
            </p>

            {parsedMath && (
              <div className="mt-2.5 p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                    Fórmula algebraica traducida:
                  </span>
                  <span className="text-base font-mono font-bold text-emerald-400">
                    {parsedMath}
                  </span>
                </div>
                <button
                  onClick={handleApplySpoken}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  Insertar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spoken Math Help Modal */}
      {showVoiceHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowVoiceHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">¿Cómo dictar respuestas por voz?</h3>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Nuestro motor de reconocimiento convierte tu voz en expresiones algebraicas al instante:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block font-semibold">Tú dices:</span>
                <span className="text-slate-200 italic">"equis al cuadrado más seis equis más nueve"</span>
                <span className="text-emerald-400 block font-mono font-bold mt-1">➜ x² + 6x + 9</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block font-semibold">Tú dices:</span>
                <span className="text-slate-200 italic">"paréntesis x más cuatro paréntesis x menos cuatro"</span>
                <span className="text-emerald-400 block font-mono font-bold mt-1">➜ (x + 4)(x - 4)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-slate-400 block font-semibold">Tú dices:</span>
                <span className="text-slate-200 italic">"tres equis paréntesis equis más dos"</span>
                <span className="text-emerald-400 block font-mono font-bold mt-1">➜ 3x(x + 2)</span>
              </div>
            </div>

            <button
              onClick={() => setShowVoiceHelp(false)}
              className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
            >
              ¡Entendido, vamos a probar!
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="text-[11px] text-rose-400 mt-1 absolute -bottom-5 left-0 whitespace-nowrap">
          {error}
        </div>
      )}
    </>
  );
};
