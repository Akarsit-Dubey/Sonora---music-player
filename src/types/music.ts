export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  duration: number; // in seconds
  genre: string;
  artworkUrl: string;
  audioUrl: string;
  explicit?: boolean;
  bpm?: number;
  year?: number;
  playCount?: number;
  lyrics?: string[];
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  genres: string[];
  monthlyListeners: number;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  description: string;
  trackIds: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  trackIds: string[];
  isUserCreated: boolean;
  createdAt: string;
  updatedAt: string;
  curator?: string;
  color?: string; // hex or gradient for ambient background
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrackId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  queue: string[]; // Track IDs
  originalQueue: string[]; // Unshuffled queue
  history: string[]; // Track IDs played previously
  isBuffering: boolean;
  playbackError: string | null;
  isQueueOpen: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
