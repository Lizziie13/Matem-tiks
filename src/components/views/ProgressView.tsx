import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle,
  Clock,
  Edit2,
  Flame,
  Gift,
  GraduationCap,
  HelpCircle,
  Medal,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { TOPICS } from '../../utils/mathQuestions';
import { sound } from '../../utils/audio';
import { CyberAvatar, CYBER_AVATARS } from '../CyberAvatar';
import { StreakTracker } from '../StreakTracker';
import { ProfileCustomizationModal } from '../ProfileCustomizationModal';
import { InteractiveTutorialModal } from '../InteractiveTutorialModal';
import { CyberAvatarSelectorModal } from '../CyberAvatarSelectorModal';
import { AdaptivePathCard } from '../AdaptivePathCard';

export const ProgressView: React.FC<{
  onPracticeTopic?: (topicId: string) => void;
  onNavigateToBadges?: () => void;
}> = ({
  onPracticeTopic,
  onNavigateToBadges,
}) => {
  const {
    profile,
    topicProgress,
    dailyChallenges,
    claimChallengeReward,
    toggleNotifications,
  } = useGame();

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const handleNotificationClick = async () => {
    sound.playTap();
    const enabled = await toggleNotifications();
    setNotificationMsg(
      enabled
        ? '¡Notificaciones push activadas! Te enviaremos recordatorios diarios.'
        : 'Las notificaciones no se activaron o están deshabilitadas en tu navegador.'
    );
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Find weak topics (accuracy < 70% and completed >= 1)
  const weakTopics = TOPICS.filter((t) => {
    const prog = topicProgress[t.id];
    return prog && prog.exercisesCompleted > 0 && prog.accuracy < 75;
  });

  const nextLevelXp = profile.level * 250;
  const currentLevelXp = profile.xp % 250;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 250) * 100));

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      {/* Top Banner: Student Level & Progression */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-slate-900 border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="cursor-pointer group relative"
              onClick={() => setShowAvatarModal(true)}
              title="Cambiar avatar ciber-matemático"
            >
              <CyberAvatar id={profile.avatarId} size="lg" />
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold shadow">
                <Edit2 className="w-2.5 h-2.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {profile.studentParalelo || 'Paralelo A'}
                </span>
                <span className="text-xs text-slate-400">
                  Docente: <strong className="text-slate-200">{profile.teacherName || 'Prof. Ariliz Aponte'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-xl font-black text-white">{profile.name}</h2>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-slate-400 hover:text-white p-1"
                  title="Editar datos del estudiante"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-indigo-400">
                  {CYBER_AVATARS.find((a) => a.id === profile.avatarId)?.title || 'Arquitecto Polinomial'}
                </span>
                <span>·</span>
                <span>Nivel {profile.level}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                sound.playTap();
                setShowProfileModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition active:scale-95 shadow"
              title="Personalizar perfil, paralelo y avatar"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Personalizar Perfil</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setShowTutorialModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition active:scale-95 shadow"
              title="Ver tutorial interactivo de Algebrik"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Tutorial</span>
            </button>

            {onNavigateToBadges && (
              <button
                onClick={onNavigateToBadges}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition active:scale-95 shadow"
                title="Ver medallas y logros"
              >
                <Medal className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.unlockedBadgeIds?.length || 3} Medallas</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300">
              <span>🪙</span>
              <span>{profile.coins}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-orange-950/60 border border-orange-500/30 text-xs font-semibold text-orange-300">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>{profile.streakDays} días</span>
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>Experiencia de Nivel</span>
            <span className="font-mono text-indigo-300">
              {currentLevelXp} / 250 XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-md"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI-Powered Adaptive Learning Path Component */}
      <AdaptivePathCard />

      {/* Gamified Consecutive Days Streak Tracker */}
      <StreakTracker onQuickPractice={() => onPracticeTopic?.('binomio-cuadrado')} />

      {/* Daily Challenges (Desafíos Diarios) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Desafíos Diarios</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Se renuevan cada medianoche</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {dailyChallenges.map((ch) => (
            <div
              key={ch.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition ${
                ch.completed
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{ch.icon}</span>
                  <span className="text-[11px] font-mono font-bold text-amber-400">
                    +{ch.rewardXp} XP · +{ch.rewardCoins} 🪙
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{ch.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{ch.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">
                  {Math.min(ch.currentCount, ch.targetCount)} / {ch.targetCount}
                </span>

                {ch.completed ? (
                  ch.claimed ? (
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Reclamado
                    </span>
                  ) : (
                    <button
                      onClick={() => claimChallengeReward(ch.id)}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/30 active:scale-95 flex items-center gap-1"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Reclamar
                    </button>
                  )
                ) : (
                  <span className="text-[11px] text-slate-500 font-semibold">En progreso</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notification & Study Reminder */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Recordatorios de Estudio Diarios</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Recibe notificaciones en tu celular a las 18:00 para mantener tu racha y vidas llenas.
            </p>
          </div>
        </div>

        <button
          onClick={handleNotificationClick}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow active:scale-95 whitespace-nowrap ${
            profile.notificationsEnabled
              ? 'bg-emerald-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
          }`}
        >
          {profile.notificationsEnabled ? '✓ Notificaciones Activas' : 'Activar Notificaciones'}
        </button>
      </div>

      {notificationMsg && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 text-xs text-indigo-200 animate-in fade-in">
          {notificationMsg}
        </div>
      )}

      {/* Weak Points Alert / Temas a Reforzar */}
      {weakTopics.length > 0 && (
        <div className="p-5 rounded-3xl bg-rose-950/40 border border-rose-500/40">
          <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-rose-400" />
            <span>Temas Detectados a Reforzar</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weakTopics.map((topic) => {
              const prog = topicProgress[topic.id];
              return (
                <div
                  key={topic.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{topic.shortTitle}</h5>
                    <span className="text-[11px] text-rose-400 font-mono">
                      {prog.accuracy}% de efectividad
                    </span>
                  </div>
                  {onPracticeTopic && (
                    <button
                      onClick={() => onPracticeTopic(topic.id)}
                      className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                    >
                      Reforzar Ahora
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mastery by Topic Overview */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">
          Dominio por Contenido Temático
        </h3>

        <div className="space-y-4">
          {TOPICS.map((topic) => {
            const prog = topicProgress[topic.id] || {
              exercisesCompleted: 0,
              correctCount: 0,
              accuracy: 0,
              masteryLevel: 1,
            };

            return (
              <div key={topic.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{topic.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      ({prog.correctCount}/{prog.exercisesCompleted} aciertos)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-400">
                      {prog.exercisesCompleted > 0 ? `${prog.accuracy}%` : '0%'}
                    </span>
                    <div className="flex text-amber-400 text-[10px]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={s <= prog.masteryLevel ? 'text-amber-400' : 'text-slate-700'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      prog.accuracy >= 80
                        ? 'bg-emerald-500'
                        : prog.accuracy >= 60
                        ? 'bg-blue-500'
                        : prog.accuracy > 0
                        ? 'bg-amber-500'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${prog.accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <ProfileCustomizationModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <InteractiveTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onOpenProfileCustomizer={() => setShowProfileModal(true)}
      />

      <CyberAvatarSelectorModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};
