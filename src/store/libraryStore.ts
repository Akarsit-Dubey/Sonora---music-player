import { create } from 'zustand';
import type { Playlist } from '../types/music';
import { DEFAULT_PLAYLISTS } from '../data/playlists';

import { safeStorage } from '../utils/storage';

const STORAGE_KEYS = {
  PLAYLISTS: 'sonora_playlists_v1',
  LIKED_TRACKS: 'sonora_liked_tracks_v1',
  RECENTLY_PLAYED: 'sonora_recently_played_v1',
};

// Safe JSON parser helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = safeStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to parse ${key} from storage:`, e);
    return fallback;
  }
}

interface LibraryState {
  playlists: Playlist[];
  likedTrackIds: string[];
  recentlyPlayedIds: string[];

  // Playlist actions
  createPlaylist: (title: string, description?: string) => string;
  updatePlaylist: (id: string, updates: Partial<Pick<Playlist, 'title' | 'description' | 'coverUrl'>>) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => boolean;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  getPlaylistById: (id: string) => Playlist | undefined;

  // Like actions
  toggleLikeTrack: (trackId: string) => boolean;
  isLiked: (trackId: string) => boolean;

  // History
  addRecentlyPlayed: (trackId: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => {
  // Initial state from storage
  const storedPlaylists = loadFromStorage<Playlist[]>(STORAGE_KEYS.PLAYLISTS, DEFAULT_PLAYLISTS);
  // Ensure default playlists always exist
  const mergedPlaylists = [...storedPlaylists];
  for (const def of DEFAULT_PLAYLISTS) {
    if (!mergedPlaylists.some(p => p.id === def.id)) {
      mergedPlaylists.push(def);
    }
  }

  const storedLikes = loadFromStorage<string[]>(STORAGE_KEYS.LIKED_TRACKS, [
    'track-1',
    'track-2',
    'track-4',
  ]);

  const storedRecent = loadFromStorage<string[]>(STORAGE_KEYS.RECENTLY_PLAYED, [
    'track-1',
    'track-2',
    'track-3',
  ]);

  return {
    playlists: mergedPlaylists,
    likedTrackIds: storedLikes,
    recentlyPlayedIds: storedRecent,

    createPlaylist: (title: string, description: string = '') => {
      const newId = `user-playlist-${Date.now()}`;
      const newPlaylist: Playlist = {
        id: newId,
        title: title.trim() || 'My Playlist',
        description: description.trim(),
        trackIds: [],
        isUserCreated: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        curator: 'You',
        color: '#D4FF00',
      };

      const updated = [newPlaylist, ...get().playlists];
      safeStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      set({ playlists: updated });
      return newId;
    },

    updatePlaylist: (id, updates) => {
      const updated = get().playlists.map(p => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      safeStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      set({ playlists: updated });
    },

    deletePlaylist: (id) => {
      const target = get().playlists.find(p => p.id === id);
      if (!target || !target.isUserCreated) return; // Prevent deleting editorial playlists

      const updated = get().playlists.filter(p => p.id !== id);
      safeStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      set({ playlists: updated });
    },

    addTrackToPlaylist: (playlistId, trackId) => {
      const playlist = get().playlists.find(p => p.id === playlistId);
      if (!playlist) return false;
      if (playlist.trackIds.includes(trackId)) return false; // Avoid duplicates

      const updated = get().playlists.map(p => {
        if (p.id === playlistId) {
          return {
            ...p,
            trackIds: [...p.trackIds, trackId],
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      safeStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      set({ playlists: updated });
      return true;
    },

    removeTrackFromPlaylist: (playlistId, trackId) => {
      const updated = get().playlists.map(p => {
        if (p.id === playlistId) {
          return {
            ...p,
            trackIds: p.trackIds.filter(id => id !== trackId),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });

      safeStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updated));
      set({ playlists: updated });
    },

    getPlaylistById: (id) => {
      return get().playlists.find(p => p.id === id);
    },

    toggleLikeTrack: (trackId) => {
      const { likedTrackIds } = get();
      const isAlreadyLiked = likedTrackIds.includes(trackId);
      const updated = isAlreadyLiked
        ? likedTrackIds.filter(id => id !== trackId)
        : [trackId, ...likedTrackIds];

      safeStorage.setItem(STORAGE_KEYS.LIKED_TRACKS, JSON.stringify(updated));
      set({ likedTrackIds: updated });
      return !isAlreadyLiked;
    },

    isLiked: (trackId) => {
      return get().likedTrackIds.includes(trackId);
    },

    addRecentlyPlayed: (trackId) => {
      const { recentlyPlayedIds } = get();
      const updated = [trackId, ...recentlyPlayedIds.filter(id => id !== trackId)].slice(0, 30);
      safeStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updated));
      set({ recentlyPlayedIds: updated });
    },
  };
});
