export interface LyricLine {
  time: number; // in seconds from start of track
  text: string;
}

export interface TrackLyrics {
  trackId: string;
  synced: boolean;
  lines: LyricLine[];
  source?: string;
  externalLyricsUrl?: string;
  isUserSupplied?: boolean;
}
