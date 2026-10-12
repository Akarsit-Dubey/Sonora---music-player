import { create } from 'zustand';
import type { RepeatMode } from '../types/music';
import { TRACKS } from '../data/tracks';

// Helper to shuffle array non-mutatively
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

import { safeStorage } from '../utils/storage';

// Load persisted settings
const savedVolume = parseFloat(safeStorage.getItem('sonora_volume') ?? '0.85');
const savedRepeat = (safeStorage.getItem('sonora_repeat') as RepeatMode) ?? 'off';
const savedShuffle = safeStorage.getItem('sonora_shuffle') === 'true';

interface PlayerStoreState {
  currentTrackId: string | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  previousVolume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  queue: string[]; // List of track IDs
  originalQueue: string[]; // Order before shuffle
  history: string[];
  isBuffering: boolean;
  playbackError: string | null;
  isQueueOpen: boolean;

  // Actions
  playTrack: (trackId: string, contextTrackIds?: string[]) => void;
  shufflePlay: (trackIds: string[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: (currentTimeThreshold?: number) => void;
  handleTrackEnded: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (trackId: string) => void;
  playNext: (trackId: string) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  jumpToQueueIndex: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  toggleQueue: () => void;
  setQueueOpen: (isOpen: boolean) => void;
  setBuffering: (isBuffering: boolean) => void;
  setPlaybackError: (error: string | null) => void;
}

const DEFAULT_TRACK_ID = TRACKS[0]?.id ?? 'track-1';
const ALL_TRACK_IDS = TRACKS.map(t => t.id);

export const usePlayerStore = create<PlayerStoreState>((set, get) => ({
  currentTrackId: DEFAULT_TRACK_ID,
  isPlaying: false,
  volume: isNaN(savedVolume) ? 0.85 : Math.max(0, Math.min(1, savedVolume)),
  isMuted: false,
  previousVolume: 0.85,
  shuffle: savedShuffle,
  repeatMode: savedRepeat,
  queue: ALL_TRACK_IDS,
  originalQueue: ALL_TRACK_IDS,
  history: [],
  isBuffering: false,
  playbackError: null,
  isQueueOpen: false,

  playTrack: (trackId: string, contextTrackIds?: string[]) => {
    const { shuffle, currentTrackId, history } = get();
    const newHistory = currentTrackId && currentTrackId !== trackId
      ? [...history, currentTrackId].slice(-50)
      : history;

    let newQueue: string[];
    let newOriginalQueue: string[];

    if (contextTrackIds && contextTrackIds.length > 0) {
      newOriginalQueue = [...contextTrackIds];
      if (shuffle) {
        // Place chosen track first, shuffle the rest
        const rest = contextTrackIds.filter(id => id !== trackId);
        newQueue = [trackId, ...shuffleArray(rest)];
      } else {
        newQueue = [...contextTrackIds];
      }
    } else {
      const currentQueue = get().queue;
      if (!currentQueue.includes(trackId)) {
        newQueue = [...currentQueue, trackId];
        newOriginalQueue = [...get().originalQueue, trackId];
      } else {
        newQueue = currentQueue;
        newOriginalQueue = get().originalQueue;
      }
    }

    set({
      currentTrackId: trackId,
      isPlaying: true,
      queue: newQueue,
      originalQueue: newOriginalQueue,
      history: newHistory,
      playbackError: null,
    });
  },

  shufflePlay: (trackIds: string[]) => {
    if (trackIds.length === 0) return;
    const randIdx = Math.floor(Math.random() * trackIds.length);
    const chosen = trackIds[randIdx];
    const { shuffle } = get();
    if (!shuffle) {
      get().toggleShuffle();
    }
    get().playTrack(chosen, trackIds);
  },

  togglePlay: () => {
    const { isPlaying, currentTrackId } = get();
    if (!currentTrackId) {
      const first = get().queue[0] ?? DEFAULT_TRACK_ID;
      get().playTrack(first);
      return;
    }
    set({ isPlaying: !isPlaying, playbackError: null });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true, playbackError: null }),

  nextTrack: () => {
    const { queue, currentTrackId, repeatMode, history } = get();
    if (!currentTrackId || queue.length === 0) return;

    if (repeatMode === 'one') {
      // Re-trigger current track
      set({ isPlaying: true });
      return;
    }

    const currentIndex = queue.indexOf(currentTrackId);
    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // Queue finished
        set({ isPlaying: false });
        return;
      }
    }

    const nextId = queue[nextIndex];
    const newHistory = [...history, currentTrackId].slice(-50);
    set({
      currentTrackId: nextId,
      isPlaying: true,
      history: newHistory,
      playbackError: null,
    });
  },

  prevTrack: () => {
    const { queue, currentTrackId, history } = get();
    if (!currentTrackId || queue.length === 0) return;

    // Check if we can go to history
    if (history.length > 0) {
      const prevId = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      set({
        currentTrackId: prevId,
        isPlaying: true,
        history: newHistory,
        playbackError: null,
      });
      return;
    }

    // Otherwise use queue index
    const currentIndex = queue.indexOf(currentTrackId);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevId = queue[prevIndex];
    set({
      currentTrackId: prevId,
      isPlaying: true,
      playbackError: null,
    });
  },

  handleTrackEnded: () => {
    const { repeatMode } = get();
    if (repeatMode === 'one') {
      // Repeat current track
      const { currentTrackId } = get();
      if (currentTrackId) {
        set({ isPlaying: true });
      }
    } else {
      get().nextTrack();
    }
  },

  setVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    safeStorage.setItem('sonora_volume', clamped.toString());
    set({
      volume: clamped,
      isMuted: clamped === 0,
      previousVolume: clamped > 0 ? clamped : get().previousVolume,
    });
  },

  toggleMute: () => {
    const { isMuted, volume, previousVolume } = get();
    if (isMuted) {
      const restore = previousVolume > 0 ? previousVolume : 0.85;
      safeStorage.setItem('sonora_volume', restore.toString());
      set({ isMuted: false, volume: restore });
    } else {
      set({ isMuted: true, previousVolume: volume > 0 ? volume : 0.85, volume: 0 });
    }
  },

  toggleShuffle: () => {
    const { shuffle, queue, currentTrackId, originalQueue } = get();
    const nextShuffle = !shuffle;
    safeStorage.setItem('sonora_shuffle', String(nextShuffle));

    if (nextShuffle) {
      // Enable shuffle: keep current track first, shuffle remainder
      const rest = queue.filter(id => id !== currentTrackId);
      const shuffledRest = shuffleArray(rest);
      const newQueue = currentTrackId ? [currentTrackId, ...shuffledRest] : shuffledRest;
      set({ shuffle: true, queue: newQueue });
    } else {
      // Restore original queue order
      set({ shuffle: false, queue: [...originalQueue] });
    }
  },

  cycleRepeatMode: () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const current = get().repeatMode;
    const nextIndex = (modes.indexOf(current) + 1) % modes.length;
    const nextMode = modes[nextIndex];
    safeStorage.setItem('sonora_repeat', nextMode);
    set({ repeatMode: nextMode });
  },

  addToQueue: (trackId: string) => {
    const { queue, originalQueue } = get();
    set({
      queue: [...queue, trackId],
      originalQueue: [...originalQueue, trackId],
    });
  },

  playNext: (trackId: string) => {
    const { queue, currentTrackId, originalQueue } = get();
    const currentIndex = currentTrackId ? queue.indexOf(currentTrackId) : -1;
    const insertIndex = currentIndex >= 0 ? currentIndex + 1 : queue.length;
    
    const newQueue = [...queue];
    newQueue.splice(insertIndex, 0, trackId);
    
    set({
      queue: newQueue,
      originalQueue: [...originalQueue, trackId],
    });
  },

  removeFromQueue: (index: number) => {
    const { queue } = get();
    if (index < 0 || index >= queue.length) return;
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    set({ queue: newQueue });
  },

  clearQueue: () => {
    const { currentTrackId } = get();
    set({ queue: currentTrackId ? [currentTrackId] : [] });
  },

  jumpToQueueIndex: (index: number) => {
    const { queue, currentTrackId, history } = get();
    if (index < 0 || index >= queue.length) return;
    const nextId = queue[index];
    const newHistory = currentTrackId ? [...history, currentTrackId].slice(-50) : history;
    set({
      currentTrackId: nextId,
      isPlaying: true,
      history: newHistory,
      playbackError: null,
    });
  },

  reorderQueue: (startIndex: number, endIndex: number) => {
    const { queue } = get();
    const result = Array.from(queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ queue: result });
  },

  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen })),
  setQueueOpen: (isOpen: boolean) => set({ isQueueOpen: isOpen }),
  setBuffering: (isBuffering: boolean) => set({ isBuffering }),
  setPlaybackError: (playbackError: string | null) => set({ playbackError }),
}));
