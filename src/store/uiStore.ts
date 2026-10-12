import { create } from 'zustand';
import type { ToastMessage } from '../types/music';

interface UiState {
  toasts: ToastMessage[];
  isCreatePlaylistOpen: boolean;
  editingPlaylistId: string | null;
  isShortcutsOpen: boolean;
  deletePlaylistConfirmId: string | null;
  addToPlaylistTrackId: string | null;

  // Actions
  addToast: (title: string, message?: string, type?: ToastMessage['type'], duration?: number) => void;
  removeToast: (id: string) => void;
  setCreatePlaylistOpen: (open: boolean) => void;
  setEditingPlaylistId: (id: string | null) => void;
  setShortcutsOpen: (open: boolean) => void;
  setDeletePlaylistConfirmId: (id: string | null) => void;
  setAddToPlaylistTrackId: (trackId: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  isCreatePlaylistOpen: false,
  editingPlaylistId: null,
  isShortcutsOpen: false,
  deletePlaylistConfirmId: null,
  addToPlaylistTrackId: null,

  addToast: (title, message, type = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type, duration };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  setCreatePlaylistOpen: (open) => set({ isCreatePlaylistOpen: open }),
  setEditingPlaylistId: (id) => set({ editingPlaylistId: id }),
  setShortcutsOpen: (open) => set({ isShortcutsOpen: open }),
  setDeletePlaylistConfirmId: (id) => set({ deletePlaylistConfirmId: id }),
  setAddToPlaylistTrackId: (trackId) => set({ addToPlaylistTrackId: trackId }),
}));
