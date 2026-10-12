import { create } from 'zustand';

interface ProgressState {
  currentTime: number;
  duration: number;
  seekTarget: number | null;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  requestSeek: (time: number) => void;
  clearSeekRequest: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  currentTime: 0,
  duration: 0,
  seekTarget: null,
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  requestSeek: (time) => set({ seekTarget: time }),
  clearSeekRequest: () => set({ seekTarget: null }),
}));
