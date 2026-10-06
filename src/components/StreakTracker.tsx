import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Gift,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

interface StreakMilestone {
  days: number;
  title: string;
  rewardXp: number;
  rewardCoins: number;
  rewardDesc: string;
  icon: string;
}

const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    title: 'Hito de Constancia',
    rewardXp: 50,
    rewardCoins: 40,
    rewardDesc: '+50 XP y +40 Monedas',
    icon: '🥉',
  },
  {
    days: 7,
    title: 'Semana Perfecta',
    rewardXp: 120,
    rewardCoins: 80,
    rewardDesc: '+120 XP, +80 🪙 y Multiplicador x1.5',
    icon: '🥈',
  },
  {
    days: 14,
    title: 'Maestro de la Disciplina',
    rewardXp: 250,
    rewardCoins: 150,
    rewardDesc: '+250 XP, +150 🪙 y Escudo Protector Gratis',
    icon: '🥇',
  },
  {
    days: 30,
    title: 'Leyenda de los 30 Días',
    rewardXp: 500,
    rewardCoins: 300,
    rewardDesc: '+500 XP, +300 🪙 y Título Legendario',
    icon: '👑',
  },
];

export const StreakTracker: React.FC<{ onQuickPractice?: () => void }> = ({
  onQuickPractice,
}) => {
  const { profile, claimStreakMilestone, buyStreakShield } = useGame();
  const [shieldNotice, setShieldNotice] = useState<string | null>(null);

  const streak = profile.streakDays || 0;
  const history = profile.streakHistory || [];
  const claimedMilestones = profile.claimedStreakMilestones || [];
  const todayStr = new Date().toISOString().split('T')[0];
  const hasPracticedToday = history.includes(todayStr);

  // Determine Streak Stage & Tier
  const getStreakTier = (days: number) => {
    if (days >= 30) {
      return {
        name: 'Corona Solar Eterna',
        multiplier: 'x2.0',
        color: 'from-amber-400 via-yellow-500 to-orange-500',
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/50',
        glowColor: 'rgba(251, 191, 36, 0.4)',
        description: '¡Nivel máximo de constancia cósmica! Multiplicador de experiencia duplicado.',
      };
    }
    if (days >= 14) {
      return {
        name: 'Supernova Polinomial',
        multiplier: 'x1.8',
        color: 'from-purple-500 via-fuchsia-500 to-pink-500',
        textColor: 'text-fuchsia-400',
        borderColor: 'border-fuchsia-500/50',
        glowColor: 'rgba(217, 70, 239, 0.4)',
        description: 'Tu disciplina está forjando un dominio absoluto sobre el álgebra.',
      };
    }
    if (days >= 7) {
      return {
        name: 'Plasma Cuántico',
        multiplier: 'x1.5',
        color: 'from-cyan-400 via-blue-500 to-indigo-500',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/50',
        glowColor: 'rgba(56, 189, 248, 0.4)',
        description: '¡Fuego azul de alta energía! Ganas +50% de XP adicional por ejercicio.',
      };
    }
    if (days >= 3) {
      return {
        name: 'Llama Ardiente',
        multiplier: 'x1.2',
        color: 'from-orange-500 via-amber-500 to-rose-500',
        textColor: 'text-orange-400',
        borderColor: 'border-orange-500/50',
        glowColor: 'rgba(249, 115, 22, 0.4)',
        description: 'La llama está encendida y creciendo. ¡Mantén el hábito diario!',
      };
    }
    return {
      name: 'Chispa de Inicio',
      multiplier: 'x1.0',
      color: 'from-slate-400 via-orange-400 to-amber-500',
      textColor: 'text-amber-300',
      borderColor: 'border-slate-700',
      glowColor: 'rgba(245, 158, 11, 0.2)',
      description: 'Cada día que practicas refuerza tu memoria a largo plazo.',
    };
  };

  const currentTier = getStreakTier(streak);

  // Compute Current Week Days (Monday to Sunday)
  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = (dayOfWeek + 6) % 7; // days since Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    const week = [];
    const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const isPastOrToday = d <= now;
      const isToday = iso === todayStr;
      const isCompleted = history.includes(iso);

      week.push({
        label: dayLabels[i],
        dayNum: d.getDate(),
        dateStr: iso,
        isToday,
        isCompleted,
        isPastOrToday,
      });
    }
    return week;
  };

  const weekDays = getWeekDates();

  // Compute last 28 days for mini heatmap
  const getRecentHeatmapDays = () => {
    const days = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const iso = d.toISOString().split('T')[0];
      const active = history.includes(iso);
      const isToday = iso === todayStr;
      days.push({ iso, active, isToday, dayNum: d.getDate() });
    }
    return days;
  };

  const heatmapDays = getRecentHeatmapDays();

  const handleClaimMilestone = (milestone: StreakMilestone) => {
    sound.playVictory();
    claimStreakMilestone(milestone.days, milestone.rewardXp, milestone.rewardCoins);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
    });
  };

  const handleBuyShield = () => {
    sound.playTap();
    if (profile.coins >= 80 && !profile.streakShieldActive) {
      const ok = buyStreakShield();
      if (ok) {
        setShieldNotice('¡Escudo de Racha activado! Tu fuego está protegido.');
      }
    } else {
      sound.playIncorrect();
      setShieldNotice('Necesitas 80 monedas para activar el escudo.');
    }
    setTimeout(() => setShieldNotice(null), 3500);
  };

  return (
    <div className="space-y-4 rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl relative overflow-hidden animate-in fade-in">
      {/* Background radial glow */}
      <div
        className="absolute -top-24 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ background: currentTier.glowColor }}
      />

      {/* 1. Header: Big Flame, Streak Counter & Tier Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Animated Big Flame Icon */}
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentTier.color} p-0.5 flex items-center justify-center shadow-lg relative shrink-0 group`}
          >
            <div className="w-full h-full bg-slate-950/80 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <Flame
                className={`w-9 h-9 fill-current ${currentTier.textColor} animate-pulse drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]`}
              />
              {/* Particle Sparkle */}
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-slate-950/70 ${currentTier.borderColor} ${currentTier.textColor}`}
              >
                {currentTier.name}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{currentTier.multiplier} XP</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black font-mono text-white tracking-tight">
                {streak}
              </h3>
              <span className="text-sm font-bold text-slate-300">
                {streak === 1 ? 'día consecutivo' : 'días consecutivos'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
              {currentTier.description}
            </p>
          </div>
        </div>

        {/* Shield Status or Practice CTA */}
        <div className="flex flex-col sm:items-end gap-2 self-start sm:self-center">
          {hasPracticedToday ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>¡Racha de hoy completada!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onQuickPractice}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition active:scale-95"
              >
                <Flame className="w-4 h-4 fill-slate-950" />
                <span>Practicar Hoy (+1 Día)</span>
              </button>
            </div>
          )}

          {/* Shield pill */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {profile.streakShieldActive ? (
              <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Escudo congelador activo</span>
              </span>
            ) : (
              <button
                onClick={handleBuyShield}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition underline underline-offset-2"
                title="Activar escudo protector con 80 monedas"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Activar escudo protector (80 🪙)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {shieldNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-200 animate-in fade-in">
          {shieldNotice}
        </div>
      )}

      {/* 2. Weekly Calendar Timeline (Lun - Dom) */}
      <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 font-semibold">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Objetivo Semanal (Lunes a Domingo)</span>
          </span>
          <span className="text-[11px] font-mono text-indigo-400">
            {weekDays.filter((d) => d.isCompleted).length} / 7 días cumplidos
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => (
            <div
              key={day.dateStr}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border transition-all duration-300 ${
                day.isCompleted
                  ? 'bg-gradient-to-b from-orange-500/20 to-amber-500/10 border-orange-500/50 text-white shadow-md shadow-orange-500/10'
                  : day.isToday
                  ? 'bg-slate-800 border-indigo-500/60 ring-2 ring-indigo-500/40 text-white animate-pulse'
                  : day.isPastOrToday
                  ? 'bg-slate-900/60 border-slate-800 text-slate-500'
                  : 'bg-slate-900/30 border-slate-800/40 text-slate-600'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {day.label}
              </span>
              <span className="text-xs font-mono font-bold mt-0.5">
                {day.dayNum}
              </span>

              {/* Status Indicator */}
              <div className="mt-1.5 flex items-center justify-center">
                {day.isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  </div>
                ) : day.isToday ? (
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-amber-400/80 text-amber-400 flex items-center justify-center">
                    <Clock className="w-3 h-3" />
                  </div>
                ) : day.isPastOrToday ? (
                  <div className="w-4 h-4 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-slate-700">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Monthly 28-Day Activity Heatmap Grid */}
      <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span>Constancia últimos 28 días</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">Sin práctica</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
            <span className="text-[10px] text-orange-400 font-semibold">Completado</span>
          </div>
        </div>

        <div className="grid grid-cols-14 sm:grid-cols-28 gap-1">
          {heatmapDays.map((d) => (
            <div
              key={d.iso}
              title={`${d.iso}: ${d.active ? 'Práctica realizada' : 'Sin práctica'}`}
              className={`h-5 rounded-md transition-all duration-200 flex items-center justify-center text-[9px] font-mono font-bold ${
                d.active
                  ? 'bg-gradient-to-t from-orange-600 to-amber-500 text-slate-950 shadow-sm'
                  : d.isToday
                  ? 'bg-slate-800 border border-indigo-400 text-indigo-300'
                  : 'bg-slate-800/50 text-slate-600 hover:bg-slate-700/40'
              }`}
            >
              {d.dayNum}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Streak Milestones & Chest Rewards */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Cofres de Recompensas por Días Consecutivos</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {claimedMilestones.length} de {STREAK_MILESTONES.length} reclamados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {STREAK_MILESTONES.map((m) => {
            const isUnlocked = streak >= m.days;
            const isClaimed = claimedMilestones.includes(m.days);

            return (
              <div
                key={m.days}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  isClaimed
                    ? 'bg-slate-950/60 border-slate-800 text-slate-400 opacity-80'
                    : isUnlocked
                    ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{m.icon}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isClaimed
                          ? 'bg-slate-800 text-slate-400'
                          : isUnlocked
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {m.days} DÍAS
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-2">{m.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{m.rewardDesc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  {isClaimed ? (
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>Reclamado</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleClaimMilestone(m)}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/30 transition active:scale-95 flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>¡Abrir Cofre!</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Progreso:</span>
                      <span>
                        {streak}/{m.days} ({Math.max(0, m.days - streak)} restantes)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
