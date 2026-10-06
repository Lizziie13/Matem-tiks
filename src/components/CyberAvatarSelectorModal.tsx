import React from 'react';
import { Check, Shield, Sparkles, X, Zap } from 'lucide-react';
import { CyberAvatar, CYBER_AVATARS, CyberAvatarDef } from './CyberAvatar';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

interface CyberAvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CyberAvatarSelectorModal: React.FC<CyberAvatarSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, setAvatar, buyItem } = useGame();

  if (!isOpen) return null;

  const handleSelect = (avatar: CyberAvatarDef) => {
    sound.playTap();
    // In duel mode / profile, all unlocked cyber avatars can be selected immediately
    setAvatar(avatar.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/80 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Avatares Ciber-Matemáticos para Duelos
            </h3>
            <p className="text-xs text-slate-400">
              Elige tu identidad cyberpunk para desafiar a compañeros en la arena algebraica.
            </p>
          </div>
        </div>

        {/* Current Equipped Avatar Highlight */}
        <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-4">
          <CyberAvatar id={profile.avatarId} size="lg" />
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              Avatar Equipado Actualmente
            </span>
            <h4 className="text-base font-bold text-white">
              {CYBER_AVATARS.find((a) => a.id === profile.avatarId)?.name || 'Gauss Cyber-Príncipe'}
            </h4>
            <p className="text-xs text-slate-300 italic mt-0.5">
              {CYBER_AVATARS.find((a) => a.id === profile.avatarId)?.quote ||
                '«Los polinomios son los circuitos del universo cuántico.»'}
            </p>
          </div>
        </div>

        {/* Grid of Avatars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {CYBER_AVATARS.map((avatar) => {
            const isEquipped = profile.avatarId === avatar.id;

            return (
              <div
                key={avatar.id}
                onClick={() => handleSelect(avatar)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-3.5 ${
                  isEquipped
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-400'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <CyberAvatar id={avatar.id} size="md" showGlow={isEquipped} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-white truncate">{avatar.name}</h5>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                      style={{
                        backgroundColor: `${avatar.primaryColor}22`,
                        color: avatar.primaryColor,
                      }}
                    >
                      {avatar.rarity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{avatar.title}</p>
                  <p className="text-[10px] text-slate-400 italic line-clamp-1 mt-0.5">
                    {avatar.quote}
                  </p>
                </div>

                {isEquipped && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
        >
          Confirmar y Cerrar
        </button>
      </div>
    </div>
  );
};
