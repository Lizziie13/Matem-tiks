import React, { useState } from 'react';
import { Heart, Plus, Sparkles, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

export const LivesIndicator: React.FC = () => {
  const { profile, refillHearts, addCoins } = useGame();
  const [showModal, setShowModal] = useState(false);

  const handleRefillWithCoins = () => {
    if (profile.coins >= 100) {
      addCoins(-100);
      refillHearts();
      setShowModal(false);
    } else {
      sound.playIncorrect();
    }
  };

  const handleFreeBooster = () => {
    refillHearts();
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition active:scale-95"
        title="Vidas disponibles"
      >
        <div className="flex items-center -space-x-0.5">
          {[1, 2, 3].map((heartIndex) => {
            const isFilled = heartIndex <= profile.hearts;
            return (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 transition-all duration-300 ${
                  isFilled
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                    : 'text-slate-600 fill-slate-800'
                }`}
              />
            );
          })}
        </div>
        <span className="text-xs font-bold text-slate-200 ml-0.5">{profile.hearts}</span>
        {profile.hearts < profile.maxHearts && (
          <Plus className="w-3 h-3 text-emerald-400 bg-emerald-500/20 rounded-full" />
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1, 2, 3].map((idx) => (
                  <Heart
                    key={idx}
                    className={`w-8 h-8 ${
                      idx <= profile.hearts
                        ? 'text-rose-500 fill-rose-500 animate-pulse'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                ))}
              </div>

              <h3 className="text-lg font-bold text-white">Vidas de Práctica</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dispones de 3 vidas. Cada error en un ejercicio resta 1 vida para fomentar el análisis cuidadoso de cada expresión.
              </p>

              <div className="w-full mt-5 space-y-3">
                <button
                  onClick={handleRefillWithCoins}
                  disabled={profile.coins < 100 || profile.hearts >= profile.maxHearts}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition ${
                    profile.hearts >= profile.maxHearts
                      ? 'border-slate-800 bg-slate-800/40 text-slate-500 opacity-60'
                      : profile.coins >= 100
                      ? 'border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300'
                      : 'border-slate-800 bg-slate-800/30 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Recargar vidas completas</span>
                  </div>
                  <span className="text-amber-400 font-mono text-xs">100 🪙</span>
                </button>

                <button
                  onClick={handleFreeBooster}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Recarga rápida de prueba (Gratis)
                </button>
              </div>

              <div className="mt-4 text-[11px] text-slate-500">
                Las vidas se recargan automáticamente 1 cada 15 min.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
