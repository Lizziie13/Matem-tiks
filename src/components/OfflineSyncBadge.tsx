import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, WifiOff } from 'lucide-react';
import { subscribeToSync, syncQueueWithServer, SyncStats } from '../utils/offlineQueue';
import { sound } from '../utils/audio';

export const OfflineSyncBadge: React.FC = () => {
  const [stats, setStats] = useState<SyncStats>({
    pendingCount: 0,
    syncedCount: 0,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncedAt: null,
  });

  useEffect(() => {
    return subscribeToSync((newStats) => {
      setStats(newStats);
    });
  }, []);

  if (stats.pendingCount === 0 && stats.isOnline && !stats.isSyncing) {
    return null;
  }

  const handleSyncClick = () => {
    sound.playTap();
    if (stats.isOnline) {
      syncQueueWithServer();
    }
  };

  return (
    <button
      onClick={handleSyncClick}
      className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition active:scale-95 ${
        !stats.isOnline
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : stats.isSyncing
          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      }`}
      title={
        !stats.isOnline
          ? `${stats.pendingCount} ejercicios guardados en IndexedDB (offline)`
          : stats.isSyncing
          ? 'Sincronizando con el servidor...'
          : `${stats.pendingCount} ejercicios pendientes de sincronizar`
      }
    >
      {!stats.isOnline ? (
        <WifiOff className="w-3 h-3 text-amber-400" />
      ) : stats.isSyncing ? (
        <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
      ) : (
        <Database className="w-3 h-3 text-emerald-400" />
      )}
      <span>{stats.pendingCount > 0 ? `${stats.pendingCount} en cola` : 'Offline'}</span>
    </button>
  );
};
