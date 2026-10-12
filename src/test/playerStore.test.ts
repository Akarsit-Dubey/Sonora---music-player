import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from '../store/playerStore';

describe('usePlayerStore', () => {
  beforeEach(() => {
    // Reset player store
    usePlayerStore.setState({
      currentTrackId: 'track-1',
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
      shuffle: false,
      repeatMode: 'off',
      queue: ['track-1', 'track-2', 'track-3'],
      originalQueue: ['track-1', 'track-2', 'track-3'],
      history: [],
      playbackError: null,
      isQueueOpen: false,
    });
  });

  it('toggles playback', () => {
    const store = usePlayerStore.getState();
    expect(store.isPlaying).toBe(false);

    store.togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('advances to next track in queue', () => {
    const store = usePlayerStore.getState();
    store.nextTrack();

    expect(usePlayerStore.getState().currentTrackId).toBe('track-2');
    expect(usePlayerStore.getState().isPlaying).toBe(true);

    usePlayerStore.getState().nextTrack();
    expect(usePlayerStore.getState().currentTrackId).toBe('track-3');
  });

  it('stops playback at the end of queue when repeat is off', () => {
    usePlayerStore.setState({
      currentTrackId: 'track-3',
      queue: ['track-1', 'track-2', 'track-3'],
      repeatMode: 'off',
      isPlaying: true,
    });

    usePlayerStore.getState().nextTrack();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('cycles to beginning of queue when repeat is all', () => {
    usePlayerStore.setState({
      currentTrackId: 'track-3',
      queue: ['track-1', 'track-2', 'track-3'],
      repeatMode: 'all',
      isPlaying: true,
    });

    usePlayerStore.getState().nextTrack();
    expect(usePlayerStore.getState().currentTrackId).toBe('track-1');
  });

  it('navigates to previous track or history', () => {
    usePlayerStore.setState({
      currentTrackId: 'track-2',
      queue: ['track-1', 'track-2', 'track-3'],
      history: ['track-1'],
    });

    usePlayerStore.getState().prevTrack();
    expect(usePlayerStore.getState().currentTrackId).toBe('track-1');
  });

  it('handles volume and mute toggling', () => {
    const store = usePlayerStore.getState();
    store.setVolume(0.5);
    expect(usePlayerStore.getState().volume).toBe(0.5);

    store.toggleMute();
    expect(usePlayerStore.getState().isMuted).toBe(true);
    expect(usePlayerStore.getState().volume).toBe(0);

    usePlayerStore.getState().toggleMute();
    expect(usePlayerStore.getState().isMuted).toBe(false);
    expect(usePlayerStore.getState().volume).toBe(0.5);
  });

  it('cycles repeat mode off -> all -> one -> off', () => {
    const store = usePlayerStore.getState();
    expect(store.repeatMode).toBe('off');

    store.cycleRepeatMode();
    expect(usePlayerStore.getState().repeatMode).toBe('all');

    usePlayerStore.getState().cycleRepeatMode();
    expect(usePlayerStore.getState().repeatMode).toBe('one');

    usePlayerStore.getState().cycleRepeatMode();
    expect(usePlayerStore.getState().repeatMode).toBe('off');
  });

  it('manages queue operations: add, remove, clear, and jump', () => {
    const store = usePlayerStore.getState();
    store.addToQueue('track-4');
    expect(usePlayerStore.getState().queue).toContain('track-4');

    const indexToRemove = usePlayerStore.getState().queue.indexOf('track-4');
    usePlayerStore.getState().removeFromQueue(indexToRemove);
    expect(usePlayerStore.getState().queue).not.toContain('track-4');

    usePlayerStore.getState().jumpToQueueIndex(1);
    expect(usePlayerStore.getState().currentTrackId).toBe('track-2');

    usePlayerStore.getState().clearQueue();
    expect(usePlayerStore.getState().queue).toEqual(['track-2']);
  });
});
