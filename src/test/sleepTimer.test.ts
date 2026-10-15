import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSleepTimerStore } from '../store/sleepTimerStore';
import { usePlayerStore } from '../store/playerStore';

describe('useSleepTimerStore', () => {
  beforeEach(() => {
    useSleepTimerStore.getState().cancelTimer();
    usePlayerStore.setState({ isPlaying: true });
    vi.clearAllTimers();
  });

  it('initializes with inactive timer', () => {
    const state = useSleepTimerStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.isEndOfTrack).toBe(false);
    expect(state.remainingSeconds).toBeNull();
  });

  it('starts a minute-based timer and calculates seconds', () => {
    useSleepTimerStore.getState().startTimer(15);
    const state = useSleepTimerStore.getState();

    expect(state.isActive).toBe(true);
    expect(state.isEndOfTrack).toBe(false);
    expect(state.remainingSeconds).toBe(15 * 60);
    expect(state.targetDurationMinutes).toBe(15);
  });

  it('ticks down seconds and pauses playback upon expiration', () => {
    useSleepTimerStore.setState({
      isActive: true,
      isEndOfTrack: false,
      remainingSeconds: 2,
      targetDurationMinutes: 1,
    });

    useSleepTimerStore.getState().tick();
    expect(useSleepTimerStore.getState().remainingSeconds).toBe(1);

    // Final tick expires and pauses player
    useSleepTimerStore.getState().tick();
    expect(useSleepTimerStore.getState().isActive).toBe(false);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('handles end-of-track sleep timer', () => {
    useSleepTimerStore.getState().startEndOfTrackTimer();
    const state = useSleepTimerStore.getState();

    expect(state.isActive).toBe(true);
    expect(state.isEndOfTrack).toBe(true);

    useSleepTimerStore.getState().handleTrackEndedCheck();
    expect(useSleepTimerStore.getState().isActive).toBe(false);
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('cancels an active timer properly', () => {
    useSleepTimerStore.getState().startTimer(30);
    expect(useSleepTimerStore.getState().isActive).toBe(true);

    useSleepTimerStore.getState().cancelTimer();
    const state = useSleepTimerStore.getState();
    expect(state.isActive).toBe(false);
    expect(state.remainingSeconds).toBeNull();
  });
});
