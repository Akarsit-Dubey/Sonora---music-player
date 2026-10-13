import { describe, it, expect, beforeEach } from 'vitest';
import { parseLrc, getActiveLyricIndex, formatToLrc } from '../utils/lrcParser';
import { useLyricsStore } from '../store/lyricsStore';
import { safeStorage } from '../utils/storage';

describe('LRC Parser', () => {
  const sampleLrc = `
[ti:Jo Tum Mere Ho]
[ar:Anuv Jain]
[al:Gulaab & Lamhe]
[00:00.00]Jo tum mere ho
[00:04.50]Kabhi na hona juda
[00:10.25]Yeh vaada raha humdum
  `.trim();

  it('parses valid LRC text into timestamped lines while ignoring headers', () => {
    const lines = parseLrc(sampleLrc);

    expect(lines).toHaveLength(3);
    expect(lines[0]).toEqual({ time: 0, text: 'Jo tum mere ho' });
    expect(lines[1]).toEqual({ time: 4.5, text: 'Kabhi na hona juda' });
    expect(lines[2]).toEqual({ time: 10.25, text: 'Yeh vaada raha humdum' });
  });

  it('determines the active line index correctly', () => {
    const lines = [
      { time: 2.0, text: 'First line' },
      { time: 6.0, text: 'Second line' },
      { time: 12.5, text: 'Third line' },
    ];

    // Before any line starts
    expect(getActiveLyricIndex(lines, 0.5)).toBe(-1);
    expect(getActiveLyricIndex(lines, 1.9)).toBe(-1);

    // During first line
    expect(getActiveLyricIndex(lines, 2.0)).toBe(0);
    expect(getActiveLyricIndex(lines, 4.5)).toBe(0);

    // During second line
    expect(getActiveLyricIndex(lines, 6.0)).toBe(1);
    expect(getActiveLyricIndex(lines, 10.0)).toBe(1);

    // During and past third line
    expect(getActiveLyricIndex(lines, 12.5)).toBe(2);
    expect(getActiveLyricIndex(lines, 30.0)).toBe(2);
  });

  it('serializes lines back to valid LRC format', () => {
    const lines = [
      { time: 5.5, text: 'Line one' },
      { time: 65.25, text: 'Line two' },
    ];

    const lrc = formatToLrc(lines, { title: 'Test Song', artist: 'Test Artist' });
    expect(lrc).toContain('[ti:Test Song]');
    expect(lrc).toContain('[ar:Test Artist]');
    expect(lrc).toContain('[00:05.50] Line one');
    expect(lrc).toContain('[01:05.25] Line two');
  });

  it('gracefully handles empty or malformed strings', () => {
    const emptyResult = parseLrc('');
    expect(emptyResult).toEqual([]);

    const malformedResult = parseLrc('random plain text without timestamps');
    expect(malformedResult).toEqual([]);
  });
});

describe('useLyricsStore', () => {
  beforeEach(() => {
    safeStorage.clear();
    useLyricsStore.setState({
      isLyricsOpen: false,
      isLyricsFullscreen: false,
      customLyrics: {},
    });
  });

  it('toggles open state and fullscreen state', () => {
    const store = useLyricsStore.getState();
    expect(store.isLyricsOpen).toBe(false);

    store.toggleLyrics();
    expect(useLyricsStore.getState().isLyricsOpen).toBe(true);

    store.setLyricsOpen(false);
    expect(useLyricsStore.getState().isLyricsOpen).toBe(false);

    store.toggleFullscreen();
    expect(useLyricsStore.getState().isLyricsFullscreen).toBe(true);
  });

  it('retrieves preloaded synchronized lyrics for hindi catalog tracks', () => {
    const store = useLyricsStore.getState();
    const lyrics = store.getLyricsForTrack('hindi-track-1');

    expect(lyrics).toBeDefined();
    expect(lyrics?.trackId).toBe('hindi-track-1');
    expect(lyrics?.synced).toBe(true);
    expect(lyrics?.lines.length).toBeGreaterThan(0);
    expect(lyrics?.lines[0].text).toBeDefined();
    expect(typeof lyrics?.lines[0].time).toBe('number');
  });

  it('imports and stores custom LRC files', () => {
    const customLrc = `[00:01.00]Custom User Lyric Line 1\n[00:06.00]Custom User Lyric Line 2`;
    const store = useLyricsStore.getState();

    const success = store.importLrcForTrack('custom-track-id', customLrc);
    expect(success).toBe(true);

    const imported = store.getLyricsForTrack('custom-track-id');
    expect(imported).toBeDefined();
    expect(imported?.lines.length).toBe(2);
    expect(imported?.lines[0].text).toBe('Custom User Lyric Line 1');
    expect(imported?.lines[0].time).toBe(1.0);
  });

  it('handles tracks with no lyrics gracefully', () => {
    const store = useLyricsStore.getState();
    const notFound = store.getLyricsForTrack('non-existent-track-999');
    expect(notFound).toBeUndefined();
  });
});
