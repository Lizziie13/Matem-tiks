import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar, NavTab } from './components/Navbar';
import { PracticeView } from './components/views/PracticeView';
import { ExamView } from './components/views/ExamView';
import { GradesView } from './components/views/GradesView';
import { DuelView } from './components/views/DuelView';
import { TheoryView } from './components/views/TheoryView';
import { ProgressView } from './components/views/ProgressView';
import { ShopView } from './components/views/ShopView';
import { BadgesView } from './components/views/BadgesView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { sound } from './utils/audio';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('practice');
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const { profile } = useGame();

  const handleToggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sound.soundEnabled = !next;
  };

  // Determine theme container style
  const getThemeClass = () => {
    switch (profile.themeId) {
      case 'chalkboard':
        return 'bg-gradient-to-b from-[#064e3b] via-[#022c22] to-slate-950 text-emerald-100';
      case 'neon':
        return 'bg-gradient-to-b from-slate-950 via-[#180a29] to-slate-950 text-cyan-100';
      case 'cosmic':
      default:
        return 'bg-gradient-to-b from-slate-950 via-[#0f172a] to-slate-950 text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${getThemeClass()}`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSoundMuted={isSoundMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 lg:pb-12">
        {activeTab === 'practice' && <PracticeView />}
        {activeTab === 'exam' && (
          <ExamView onNavigateToGrades={() => setActiveTab('grades')} />
        )}
        {activeTab === 'grades' && <GradesView />}
        {activeTab === 'badges' && <BadgesView />}
        {activeTab === 'duel' && <DuelView />}
        {activeTab === 'theory' && <TheoryView />}
        {activeTab === 'progress' && (
          <ProgressView
            onPracticeTopic={() => {
              setActiveTab('practice');
            }}
            onNavigateToBadges={() => {
              setActiveTab('badges');
            }}
          />
        )}
        {activeTab === 'shop' && <ShopView />}
      </main>

      {/* Offline Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
