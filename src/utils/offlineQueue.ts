/**
 * IndexedDB Offline Synchronization Queue for Algebrik PWA
 * Stores exercises, attempts, and exam results offline, and automatically
 * flushes them to the server when network connectivity is restored.
 */

export interface QueuedExerciseAttempt {
  id: string;
  studentName: string;
  studentParalelo: string;
  topicId: string;
  topicTitle?: string;
  isCorrect: boolean;
  userAnswer: string;
  expression: string;
  usedVoice: boolean;
  timeSpentSeconds?: number;
  scoreOutOfTen?: number;
  attemptType: 'practice' | 'exam' | 'adaptive' | 'duel';
  timestamp: number;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  syncedAt?: number;
  error?: string;
}

export interface SyncStats {
  pendingCount: number;
  syncedCount: number;
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
}

export type SyncEventListener = (stats: SyncStats, eventType: 'enqueue' | 'sync_start' | 'sync_success' | 'sync_error' | 'online' | 'offline') => void;

const DB_NAME = 'algebrik_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'sync_queue';
const META_KEY_LAST_SYNC = 'algebrik_last_sync_timestamp';

let dbInstance: IDBDatabase | null = null;
let isSyncInProgress = false;
const listeners: Set<SyncEventListener> = new Set();

/**
 * Opens or retrieves the IndexedDB database connection
 */
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      return resolve(dbInstance);
    }

    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('topicId', 'topicId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Notifies all registered listeners of queue updates
 */
async function notifyListeners(eventType: 'enqueue' | 'sync_start' | 'sync_success' | 'sync_error' | 'online' | 'offline') {
  try {
    const stats = await getQueueStats();
    listeners.forEach((listener) => {
      try {
        listener(stats, eventType);
      } catch (err) {
        console.error('Error in sync event listener:', err);
      }
    });
  } catch (err) {
    console.error('Error calculating sync stats for notification:', err);
  }
}

/**
 * Subscribes to sync queue state changes
 */
export function subscribeToSync(listener: SyncEventListener): () => void {
  listeners.add(listener);
  // Send initial state immediately
  getQueueStats().then((stats) => listener(stats, 'online')).catch(() => {});
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Enqueues an exercise or exam attempt into IndexedDB
 */
export async function enqueueAttempt(
  data: Omit<QueuedExerciseAttempt, 'id' | 'timestamp' | 'status' | 'retryCount'>
): Promise<QueuedExerciseAttempt> {
  const db = await openDatabase();

  const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const item: QueuedExerciseAttempt = {
    ...data,
    id,
    timestamp: Date.now(),
    status: 'pending',
    retryCount: 0,
  };

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  notifyListeners('enqueue');

  // If online, trigger background flush immediately
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    syncQueueWithServer().catch(() => {});
  }

  return item;
}

/**
 * Retrieves all pending or failed attempts in the queue
 */
export async function getPendingAttempts(): Promise<QueuedExerciseAttempt[]> {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const statusIndex = store.index('status');
    const pendingRequest = statusIndex.getAll('pending');

    pendingRequest.onsuccess = () => {
      const pending = pendingRequest.result || [];
      // Also get failed for retry
      const failedRequest = statusIndex.getAll('failed');
      failedRequest.onsuccess = () => {
        const failed = failedRequest.result || [];
        resolve([...pending, ...failed].sort((a, b) => a.timestamp - b.timestamp));
      };
      failedRequest.onerror = () => resolve(pending);
    };

    pendingRequest.onerror = () => reject(pendingRequest.error);
  });
}

/**
 * Retrieves statistics for the offline synchronization queue
 */
export async function getQueueStats(): Promise<SyncStats> {
  try {
    const db = await openDatabase();

    return new Promise((resolve) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        const total = countRequest.result;
        const statusIndex = store.index('status');
        const pendingReq = statusIndex.count('pending');

        pendingReq.onsuccess = () => {
          const pending = pendingReq.result;
          const failedReq = statusIndex.count('failed');

          failedReq.onsuccess = () => {
            const failed = failedReq.result;
            const pendingTotal = pending + failed;
            const synced = Math.max(0, total - pendingTotal);
            const lastSync = Number(localStorage.getItem(META_KEY_LAST_SYNC)) || null;

            resolve({
              pendingCount: pendingTotal,
              syncedCount: synced,
              isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
              isSyncing: isSyncInProgress,
              lastSyncedAt: lastSync,
            });
          };
          failedReq.onerror = () => {
            resolve({
              pendingCount: pending,
              syncedCount: total - pending,
              isOnline: navigator.onLine,
              isSyncing: isSyncInProgress,
              lastSyncedAt: null,
            });
          };
        };
        pendingReq.onerror = () => {
          resolve({
            pendingCount: 0,
            syncedCount: total,
            isOnline: navigator.onLine,
            isSyncing: isSyncInProgress,
            lastSyncedAt: null,
          });
        };
      };

      countRequest.onerror = () => {
        resolve({
          pendingCount: 0,
          syncedCount: 0,
          isOnline: navigator.onLine,
          isSyncing: isSyncInProgress,
          lastSyncedAt: null,
        });
      };
    });
  } catch {
    return {
      pendingCount: 0,
      syncedCount: 0,
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isSyncing: isSyncInProgress,
      lastSyncedAt: null,
    };
  }
}

/**
 * Sends all pending offline attempts to the server and updates their status
 */
export async function syncQueueWithServer(): Promise<{
  success: boolean;
  syncedCount: number;
  failedCount: number;
  remainingPending: number;
}> {
  if (isSyncInProgress) {
    return { success: true, syncedCount: 0, failedCount: 0, remainingPending: 0 };
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { success: false, syncedCount: 0, failedCount: 0, remainingPending: 0 };
  }

  const pending = await getPendingAttempts();
  if (pending.length === 0) {
    return { success: true, syncedCount: 0, failedCount: 0, remainingPending: 0 };
  }

  isSyncInProgress = true;
  notifyListeners('sync_start');

  try {
    const db = await openDatabase();

    // Mark as syncing in IndexedDB
    const tx = db.transaction([STORE_NAME], 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const item of pending) {
      item.status = 'syncing';
      store.put(item);
    }
    await new Promise((res) => {
      tx.oncomplete = res;
    });

    // POST batch to server endpoint
    const response = await fetch('/api/sync-offline-attempts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attempts: pending,
        clientTimestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();

    // Mark synced in IndexedDB
    const markTx = db.transaction([STORE_NAME], 'readwrite');
    const markStore = markTx.objectStore(STORE_NAME);
    const now = Date.now();
    for (const item of pending) {
      item.status = 'synced';
      item.syncedAt = now;
      markStore.put(item);
    }
    await new Promise((res) => {
      markTx.oncomplete = res;
    });

    localStorage.setItem(META_KEY_LAST_SYNC, String(now));
    isSyncInProgress = false;
    notifyListeners('sync_success');

    return {
      success: true,
      syncedCount: pending.length,
      failedCount: 0,
      remainingPending: 0,
    };
  } catch (err: any) {
    console.warn('Sync with server failed, reverting status to pending/failed for retry:', err?.message || err);

    // Revert status to failed/pending for retry
    try {
      const db = await openDatabase();
      const revertTx = db.transaction([STORE_NAME], 'readwrite');
      const revertStore = revertTx.objectStore(STORE_NAME);
      for (const item of pending) {
        item.status = 'failed';
        item.retryCount = (item.retryCount || 0) + 1;
        item.error = err?.message || 'Error de conexión';
        revertStore.put(item);
      }
      await new Promise((res) => {
        revertTx.oncomplete = res;
      });
    } catch {}

    isSyncInProgress = false;
    notifyListeners('sync_error');

    return {
      success: false,
      syncedCount: 0,
      failedCount: pending.length,
      remainingPending: pending.length,
    };
  }
}

/**
 * Initializes automatic background synchronization on network reconnect
 */
export function initAutoSync(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    notifyListeners('online');
    // Give browser a moment to stabilize DNS/connection, then flush
    setTimeout(() => {
      syncQueueWithServer().catch(() => {});
    }, 1500);
  };

  const handleOffline = () => {
    notifyListeners('offline');
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Initial check on load
  if (navigator.onLine) {
    setTimeout(() => {
      syncQueueWithServer().catch(() => {});
    }, 2000);
  }

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
