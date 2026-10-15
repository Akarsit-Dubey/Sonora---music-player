import { create } from 'zustand';
import { usePlayerStore } from './playerStore';
import { useUiStore } from './uiStore';

interface SleepTimerState {
  isActive: boolean;
  isEndOfTrack: boolean;
  remainingSeconds: number | null;
  targetDurationMinutes: number | null;

  // Actions
  startTimer: (minutes: number) => void;
  startEndOfTrackTimer: () => void;
  cancelTimer: () => void;
  tick: () => void;
  handleTrackEndedCheck: () => void;
}

let timerInterval: ReturnType<typeof setInterval> | null = null;

export const useSleepTimerStore = create<SleepTimerState>((set, get) => ({
  isActive: false,
  isEndOfTrack: false,
  remainingSeconds: null,
  targetDurationMinutes: null,

  startTimer: (minutes: number) => {
    if (timerInterval) clearInterval(timerInterval);

    const totalSeconds = minutes * 60;
    set({
      isActive: true,
      isEndOfTrack: false,
      remainingSeconds: totalSeconds,
      targetDurationMinutes: minutes,
    });

    useUiStore.getState().addToast(
      'Sleep Timer Set',
      `Playback will pause in ${minutes} minutes.`,
      'info'
    );

    timerInterval = setInterval(() => {
      get().tick();
    }, 1000);
  },

  startEndOfTrackTimer: () => {
    if (timerInterval) clearInterval(timerInterval);

    set({
      isActive: true,
      isEndOfTrack: true,
      remainingSeconds: null,
      targetDurationMinutes: null,
    });

    useUiStore.getState().addToast(
      'Sleep Timer Set',
      'Playback will pause at the end of the current track.',
      'info'
    );
  },

  cancelTimer: () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    set({
      isActive: false,
      isEndOfTrack: false,
      remainingSeconds: null,
      targetDurationMinutes: null,
    });
    useUiStore.getState().addToast('Sleep Timer Cancelled', 'Playback timer turned off.', 'info');
  },

  tick: () => {
    const { remainingSeconds, isActive } = get();
    if (!isActive || remainingSeconds === null) return;

    if (remainingSeconds <= 1) {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      set({
        isActive: false,
        isEndOfTrack: false,
        remainingSeconds: null,
        targetDurationMinutes: null,
      });

      // Pause playback gracefully
      usePlayerStore.getState().pause();
      useUiStore.getState().addToast(
        'Sleep Timer Finished',
        'Good night. Music has been paused.',
        'info'
      );
    } else {
      set({ remainingSeconds: remainingSeconds - 1 });
    }
  },

  handleTrackEndedCheck: () => {
    const { isActive, isEndOfTrack } = get();
    if (isActive && isEndOfTrack) {
      set({
        isActive: false,
        isEndOfTrack: false,
      });
      usePlayerStore.getState().pause();
      useUiStore.getState().addToast(
        'Sleep Timer Finished',
        'End of track reached. Music paused.',
        'info'
      );
    }
  },
}));
