import { create } from 'zustand';
import type { TrackLyrics } from '../types/lyrics';
import { BUILT_IN_LYRICS } from '../data/lyrics';
import { parseLrc } from '../utils/lrcParser';
import { safeStorage } from '../utils/storage';

const STORAGE_KEY = 'sonora_custom_lyrics_v1';

// Load stored user-supplied LRC lyrics
function loadStoredCustomLyrics(): Record<string, TrackLyrics> {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

interface LyricsStoreState {
  isLyricsOpen: boolean;
  isLyricsFullscreen: boolean;
  customLyrics: Record<string, TrackLyrics>;

  // Actions
  toggleLyrics: () => void;
  setLyricsOpen: (open: boolean) => void;
  toggleFullscreen: () => void;
  getLyricsForTrack: (trackId: string | null) => TrackLyrics | undefined;
  importLrcForTrack: (trackId: string, lrcContent: string) => boolean;
  clearCustomLyrics: (trackId: string) => void;
}

export const useLyricsStore = create<LyricsStoreState>((set, get) => ({
  isLyricsOpen: false,
  isLyricsFullscreen: false,
  customLyrics: loadStoredCustomLyrics(),

  toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen })),
  setLyricsOpen: (open) => set({ isLyricsOpen: open }),
  toggleFullscreen: () => set((state) => ({ isLyricsFullscreen: !state.isLyricsFullscreen })),

  getLyricsForTrack: (trackId) => {
    if (!trackId) return undefined;
    const { customLyrics } = get();
    // Prioritize user-supplied LRC if available
    if (customLyrics[trackId]) {
      return customLyrics[trackId];
    }
    // Fall back to built-in verified lyrics
    return BUILT_IN_LYRICS[trackId];
  },

  importLrcForTrack: (trackId, lrcContent) => {
    const lines = parseLrc(lrcContent);
    if (lines.length === 0) return false;

    const newLyrics: TrackLyrics = {
      trackId,
      synced: true,
      lines,
      source: 'User Imported LRC',
      isUserSupplied: true,
    };

    const updated = { ...get().customLyrics, [trackId]: newLyrics };
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ customLyrics: updated });
    return true;
  },

  clearCustomLyrics: (trackId) => {
    const updated = { ...get().customLyrics };
    delete updated[trackId];
    safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ customLyrics: updated });
  },
}));
