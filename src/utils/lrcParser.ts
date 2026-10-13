import type { LyricLine } from '../types/lyrics';

/**
 * Parses an LRC formatted string into an array of chronologically sorted LyricLine objects.
 * Handles single or multiple timestamps per line: [mm:ss.xx], [mm:ss], [m:ss.xxx]
 * Ignores metadata tags like [ar:Artist], [ti:Title], [al:Album].
 */
export function parseLrc(lrcContent: string): LyricLine[] {
  if (!lrcContent || typeof lrcContent !== 'string') return [];

  const lines = lrcContent.split(/\r?\n/);
  const result: LyricLine[] = [];

  // Match timestamp tags like [01:23.45] or [01:23]
  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains timestamp
    const matches = Array.from(trimmed.matchAll(timeRegex));
    if (matches.length === 0) continue;

    // Extract text after stripping all timestamp tags
    const text = trimmed.replace(timeRegex, '').trim();

    for (const match of matches) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const fractionStr = match[3] || '0';
      // Normalize fraction: if 2 digits (centiseconds), / 100; if 3 digits (ms), / 1000
      const fraction = fractionStr.length === 3 ? parseInt(fractionStr, 10) / 1000 : parseInt(fractionStr, 10) / Math.pow(10, fractionStr.length);
      const totalSeconds = Math.max(0, minutes * 60 + seconds + fraction);

      result.push({
        time: Math.round(totalSeconds * 100) / 100, // 2 decimal precision
        text: text || '♪', // Use musical note for instrumental timestamps
      });
    }
  }

  // Sort by timestamp
  result.sort((a, b) => a.time - b.time);

  return result;
}

/**
 * Finds the index of the currently active lyric line for a given playback time in seconds.
 * Returns -1 if playback time is before the first lyric line.
 */
export function getActiveLyricIndex(lines: LyricLine[], currentTime: number): number {
  if (!lines || lines.length === 0) return -1;
  if (currentTime < lines[0].time) return -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    if (currentTime >= lines[i].time) {
      return i;
    }
  }

  return -1;
}

/**
 * Formats an array of LyricLines into standard LRC text format.
 */
export function formatToLrc(lines: LyricLine[], metadata?: { title?: string; artist?: string }): string {
  const header: string[] = [];
  if (metadata?.title) header.push(`[ti:${metadata.title}]`);
  if (metadata?.artist) header.push(`[ar:${metadata.artist}]`);

  const body = lines.map((line) => {
    const mins = Math.floor(line.time / 60).toString().padStart(2, '0');
    const secs = Math.floor(line.time % 60).toString().padStart(2, '0');
    const hundredths = Math.floor((line.time % 1) * 100).toString().padStart(2, '0');
    return `[${mins}:${secs}.${hundredths}] ${line.text}`;
  });

  return [...header, ...body].join('\n');
}
