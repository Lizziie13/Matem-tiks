import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Check,
  CheckCircle2,
  Filter,
  Flame,
  Gift,
  GraduationCap,
  Lock,
  Medal,
  Mic,
  Share2,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ALL_BADGES, getBadgeCurrentProgress } from '../../utils/badges';
import { CyberAvatar } from '../CyberAvatar';
import { StudentProfileModal } from '../StudentProfileModal';
import { CyberAvatarSelectorModal } from '../CyberAvatarSelectorModal';
import { sound } from '../../utils/audio';

type BadgeCategoryFilter = 'all' | 'racha' | 'ejercicios' | 'examenes' | 'especial';

export const BadgesView: React.FC = () => {
  const {
    profile,
    gradeRecords,
    claimBadge,
  } = useGame();

  const [filter, setFilter] = useState<BadgeCategoryFilter>('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const claimedBadgeIds = profile.claimedBadgeIds || [];
  const unlockedBadgeIds = profile.unlockedBadgeIds || [];

  const handleClaimBadge = (badgeId: string) => {
    sound.playVictory();
    claimBadge(badgeId);
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const filteredBadges = ALL_BADGES.filter((badge) => {
    if (filter === 'all') return true;
    return badge.category === filter;
  });

  const unlockedCount = ALL_BADGES.filter((b) => {
    const { isUnlocked } = getBadgeCurrentProgress(b, profile, gradeRecords);
    return isUnlocked || unlockedBadgeIds.includes(b.id);
  }).length;

  const totalBadges = ALL_BADGES.length;

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Legendario':
        return {
          border: 'border-amber-400/80',
          bg: 'bg-amber-400/10',
          text: 'text-amber-300',
          badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950',
          glow: 'shadow-amber-500/20',
        };
      case 'Diamante':
        return {
          border: 'border-cyan-400/80',
          bg: 'bg-cyan-400/10',
          text: 'text-cyan-300',
          badgeBg: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950',
          glow: 'shadow-cyan-500/20',
        };
      case 'Oro':
        return {
          border: 'border-yellow-400/60',
          bg: 'bg-yellow-400/10',
          text: 'text-yellow-300',
          badgeBg: 'bg-yellow-500 text-slate-950',
          glow: 'shadow-yellow-500/20',
        };
      case 'Plata':
        return {
          border: 'border-slate-300/60',
          bg: 'bg-slate-300/10',
          text: 'text-slate-200',
          badgeBg: 'bg-slate-300 text-slate-950',
          glow: 'shadow-slate-300/10',
        };
      case 'Bronce':
      default:
        return {
          border: 'border-orange-600/50',
          bg: 'bg-orange-600/10',
          text: 'text-orange-300',
          badgeBg: 'bg-orange-700 text-white',
          glow: 'shadow-orange-700/10',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      {/* 1. Header Hero: Student Academic Credential & Badge Mastery */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div
              className="cursor-pointer group relative"
              onClick={() => setShowAvatarModal(true)}
              title="Cambiar avatar"
            >
              <CyberAvatar id={profile.avatarId} size="lg" />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-bold shadow opacity-0 group-hover:opacity-100 transition">
                Editar
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {profile.studentParalelo || 'Paralelo A'}
                </span>
                <span className="text-xs text-slate-400">
                  Docente: <strong className="text-slate-200">{profile.teacherName || 'Prof. Ariliz Aponte'}</strong>
                </span>
              </div>

              <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
                {profile.name}
              </h1>

              <p className="text-xs text-slate-300 mt-0.5">
                Vitrina Oficial de Medallas y Logros de Álgebra
              </p>
            </div>
          </div>

          {/* Quick Edit Profile & Badges KPI Pill */}
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Medallas Obtenidas
              </span>
              <div className="flex items-baseline justify-center gap-1 font-mono mt-0.5">
                <span className="text-2xl font-black text-amber-400">{unlockedCount}</span>
                <span className="text-xs text-slate-500 font-bold">/ {totalBadges}</span>
              </div>
            </div>

            <button
              onClick={() => setShowProfileModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Editar Carnet</span>
            </button>
          </div>
        </div>

        {/* Global Badges Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1.5">
            <span>Progreso General de Colección de Medallas</span>
            <span className="font-mono text-indigo-300">
              {Math.round((unlockedCount / totalBadges) * 100)}% Completado
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Category Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({ALL_BADGES.length})
          </button>
          <button
            onClick={() => setFilter('racha')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'racha'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Racha</span>
          </button>
          <button
            onClick={() => setFilter('ejercicios')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'ejercicios'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Ejercicios</span>
          </button>
          <button
            onClick={() => setFilter('examenes')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'examenes'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Exámenes 10/10</span>
          </button>
          <button
            onClick={() => setFilter('especial')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'especial'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Voz & Duelos</span>
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Mostrando {filteredBadges.length} medallas
        </span>
      </div>

      {/* 3. Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredBadges.map((badge) => {
          const { current, isUnlocked: autoUnlocked, percentage } = getBadgeCurrentProgress(
            badge,
            profile,
            gradeRecords
          );

          const isUnlocked = autoUnlocked || unlockedBadgeIds.includes(badge.id);
          const isClaimed = claimedBadgeIds.includes(badge.id);
          const style = getRarityBadgeStyle(badge.rarity);

          return (
            <div
              key={badge.id}
              className={`p-4 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                isClaimed
                  ? 'bg-slate-900/90 border-slate-800/90 shadow-md'
                  : isUnlocked
                  ? 'bg-gradient-to-br from-slate-900 to-indigo-950/60 border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/40 border-slate-800/60 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Medal Big Icon with Rarity Border */}
                    <div
                      className={`w-13 h-13 rounded-2xl border-2 flex items-center justify-center text-3xl shadow-inner ${style.border} ${style.bg} ${style.glow} shrink-0`}
                    >
                      {badge.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${style.badgeBg}`}
                        >
                          {badge.rarity}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300">
                          +{badge.rewardXp} XP · +{badge.rewardCoins} 🪙
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{badge.title}</h4>
                    </div>
                  </div>

                  {isClaimed ? (
                    <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400" title="Reclamada">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : isUnlocked ? (
                    <span className="animate-pulse text-amber-400">✨</span>
                  ) : (
                    <div className="p-1.5 rounded-full bg-slate-800 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Progress & Claim CTA */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>Progreso del Hito</span>
                  <span className="font-bold text-white">
                    {Math.min(current, badge.targetCount)} / {badge.targetCount} ({percentage}%)
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="mt-3">
                  {isClaimed ? (
                    <div className="w-full py-1.5 rounded-xl bg-slate-800/50 text-slate-400 text-xs font-bold flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Medalla en tu Carnet Oficial</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleClaimBadge(badge.id)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>¡Desbloquear y Reclamar Recompensa!</span>
                    </button>
                  ) : (
                    <div className="text-center text-[11px] text-slate-500 font-mono py-1">
                      Faltan {Math.max(0, badge.targetCount - current)} para desbloquear
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenAvatarSelector={() => setShowAvatarModal(true)}
      />

      <CyberAvatarSelectorModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};
