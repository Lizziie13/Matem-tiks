import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  LineChart,
  Medal,
  ShoppingBag,
  Swords,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { LivesIndicator } from './LivesIndicator';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineSyncBadge } from './OfflineSyncBadge';
import { CyberAvatar } from './CyberAvatar';
import { ProfileCustomizationModal } from './ProfileCustomizationModal';
import { InteractiveTutorialModal } from './InteractiveTutorialModal';
import { sound } from '../utils/audio';

export type NavTab = 'practice' | 'exam' | 'grades' | 'badges' | 'duel' | 'theory' | 'progress' | 'shop';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  isSoundMuted,
  onToggleSound,
}) => {
  const { profile, getAverageGrade } = useGame();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const avg = getAverageGrade();

  // Auto show tutorial on first visit if not completed yet
  React.useEffect(() => {
    try {
      const completed = localStorage.getItem('algebrik_tutorial_completed');
      if (!completed) {
        setShowTutorialModal(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const navItems = [
    { id: 'practice', label: 'Práctica', icon: Zap },
    { id: 'exam', label: 'Examen 10/10', icon: GraduationCap },
    { id: 'grades', label: 'Registro Notas', icon: ClipboardList },
    { id: 'badges', label: 'Medallas', icon: Medal },
    { id: 'duel', label: 'Duelos', icon: Swords },
    { id: 'theory', label: 'Fórmulas', icon: BookOpen },
    { id: 'progress', label: 'Progreso', icon: LineChart },
    { id: 'shop', label: 'Tienda', icon: ShoppingBag },
  ];

  const handleNavClick = (tabId: NavTab) => {
    sound.playTap();
    onTabChange(tabId);
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('practice')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 font-black text-lg group-hover:scale-105 transition">
              A²
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white group-hover:text-indigo-400 transition">
                  Algebrik
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Productos Notables & Factorización
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as NavTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status HUD: Lives, Coins, Average / 10, Install Button, Sound */}
          <div className="flex items-center gap-2">
            {/* Lives Heart Indicator */}
            <LivesIndicator />

            {/* Coins badge */}
            <div
              onClick={() => handleNavClick('shop')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition active:scale-95"
              title="Monedas conseguidas"
            >
              <span>🪙</span>
              <span>{profile.coins}</span>
            </div>

            {/* Average GPA badge */}
            {avg > 0 && (
              <div
                onClick={() => handleNavClick('grades')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold cursor-pointer hover:bg-emerald-500/20 transition"
                title="Promedio General sobre 10"
              >
                <span>Nota:</span>
                <span>{avg.toFixed(1)}/10</span>
              </div>
            )}

            {/* Offline Sync Status Badge */}
            <OfflineSyncBadge />

            {/* Tutorial Button */}
            <button
              onClick={() => {
                sound.playTap();
                setShowTutorialModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition active:scale-95 shadow"
              title="Abrir Tutorial Interactivo de Algebrik"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Tutorial</span>
            </button>

            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Student Profile & Avatar Customizer Button */}
            <button
              onClick={() => {
                sound.playTap();
                setShowProfileModal(true);
              }}
              className="p-0.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/60 transition active:scale-95 group relative"
              title="Personalizar perfil y carnet del estudiante"
            >
              <CyberAvatar id={profile.avatarId} size="sm" />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title={isSoundMuted ? 'Activar sonido' : 'Silenciar sonido'}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Profile & Avatar Customization Studio Modal */}
      <ProfileCustomizationModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Interactive Onboarding Tutorial Tour Modal */}
      <InteractiveTutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
        onOpenProfileCustomizer={() => setShowProfileModal(true)}
      />

      {/* Bottom Navigation Bar for Mobile (iOS & Android thumb navigation) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 safe-area-pb">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as NavTab)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                  isActive
                    ? 'text-indigo-400 scale-105'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-bold mt-0.5 whitespace-nowrap">
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
