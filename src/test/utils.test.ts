import { describe, it, expect } from 'vitest';
import { formatTime } from '../utils/formatTime';
import { generateArtworkFallback } from '../utils/artworkFallback';

describe('formatTime', () => {
  it('formats zero and negative seconds correctly', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(-10)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
  });

  it('formats seconds under a minute', () => {
    expect(formatTime(4)).toBe('0:04');
    expect(formatTime(42)).toBe('0:42');
    expect(formatTime(59)).toBe('0:59');
  });

  it('formats minutes and seconds', () => {
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(75)).toBe('1:15');
    expect(formatTime(372)).toBe('6:12');
  });

  it('formats hours, minutes, and seconds', () => {
    expect(formatTime(3600)).toBe('1:00:00');
    expect(formatTime(3665)).toBe('1:01:05');
  });
});

describe('generateArtworkFallback', () => {
  it('generates a valid SVG data URI', () => {
    const uri = generateArtworkFallback('Neon Horizon', 'Kroma System', 'track-1');
    expect(uri.startsWith('data:image/svg+xml;utf8,')).toBe(true);
    const decoded = decodeURIComponent(uri);
    expect(decoded).toContain('Neon Horizon');
    expect(decoded).toContain('Kroma System');
  });

  it('is deterministic for same input', () => {
    const uri1 = generateArtworkFallback('Solar Drift', 'Vektor Pulse', 'track-3');
    const uri2 = generateArtworkFallback('Solar Drift', 'Vektor Pulse', 'track-3');
    expect(uri1).toBe(uri2);
  });
});
