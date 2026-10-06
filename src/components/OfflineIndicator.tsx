import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import {
  getQueueStats,
  initAutoSync,
  subscribeToSync,
  syncQueueWithServer,
  SyncStats,
} from '../utils/offlineQueue';
import { sound } from '../utils/audio';

export const OfflineIndicator: React.FC = () => {
  const [stats, setStats] = useState<SyncStats>({
    pendingCount: 0,
    syncedCount: 0,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncedAt: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Initialize auto sync on network reconnection
    const cleanupAutoSync = initAutoSync();

    // Subscribe to queue updates
    const unsubscribe = subscribeToSync((newStats, eventType) => {
      setStats(newStats);

      if (eventType === 'online') {
        setToastMessage('¡Conexión a internet restablecida! Sincronizando ejercicios pendientes...');
        setTimeout(() => setToastMessage(null), 4000);
      } else if (eventType === 'sync_success' && newStats.pendingCount === 0) {
        sound.playCorrect();
        setToastMessage('✓ ¡Ejercicios offline sincronizados exitosamente con el servidor!');
        setTimeout(() => setToastMessage(null), 4000);
      } else if (eventType === 'offline') {
        setToastMessage('Modo sin conexión: Tus ejercicios se guardan de forma segura en IndexedDB.');
        setTimeout(() => setToastMessage(null), 5000);
      }
    });

    return () => {
      cleanupAutoSync();
      unsubscribe();
    };
  }, []);

  const handleManualSync = async () => {
    sound.playTap();
    setToastMessage('Sincronizando con el servidor...');
    const result = await syncQueueWithServer();
    if (result.success) {
      sound.playCorrect();
      setToastMessage(`✓ ${result.syncedCount} ejercicio(s) sincronizados con éxito.`);
    } else {
      setToastMessage('No se pudo conectar con el servidor. Se reintentará al recuperar la red.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  // If online, not syncing, no pending items and no toast, hide banner
  if (stats.isOnline && stats.pendingCount === 0 && !stats.isSyncing && !toastMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-2 max-w-md animate-in fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="w-full bg-slate-900/95 border border-indigo-500/50 text-indigo-200 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          {stats.isOnline ? (
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="flex-1 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Persistent Status Pill */}
      {(!stats.isOnline || stats.pendingCount > 0 || stats.isSyncing) && (
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-2xl backdrop-blur-md border transition ${
            !stats.isOnline
              ? 'bg-amber-950/90 text-amber-200 border-amber-500/50'
              : stats.isSyncing
              ? 'bg-indigo-950/90 text-indigo-200 border-indigo-500/50'
              : 'bg-slate-900/90 text-slate-200 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {!stats.isOnline ? (
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            ) : stats.isSyncing ? (
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
            ) : (
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            )}

            <span>
              {!stats.isOnline
                ? 'Modo sin conexión (IndexedDB activo)'
                : stats.isSyncing
                ? 'Sincronizando con el servidor...'
                : `${stats.pendingCount} ejercicio(s) en cola`}
            </span>
          </div>

          {stats.pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {stats.pendingCount} pend.
            </span>
          )}

          {stats.isOnline && stats.pendingCount > 0 && !stats.isSyncing && (
            <button
              onClick={handleManualSync}
              className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow transition active:scale-95 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Sincronizar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
