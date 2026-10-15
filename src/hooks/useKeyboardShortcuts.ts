import { useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useProgressStore } from '../store/progressStore';
import { useUiStore } from '../store/uiStore';
import { useLyricsStore } from '../store/lyricsStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Handle Escape always (closes modals / queue / lyrics)
      if (e.key === 'Escape') {
        const { isLyricsOpen, setLyricsOpen } = useLyricsStore.getState();
        if (isLyricsOpen) return setLyricsOpen(false);

        const {
          isShortcutsOpen,
          isCreatePlaylistOpen,
          editingPlaylistId,
          deletePlaylistConfirmId,
          addToPlaylistTrackId,
          setShortcutsOpen,
          setCreatePlaylistOpen,
          setEditingPlaylistId,
          setDeletePlaylistConfirmId,
          setAddToPlaylistTrackId,
        } = useUiStore.getState();

        if (isShortcutsOpen) return setShortcutsOpen(false);
        if (isCreatePlaylistOpen) return setCreatePlaylistOpen(false);
        if (editingPlaylistId) return setEditingPlaylistId(null);
        if (deletePlaylistConfirmId) return setDeletePlaylistConfirmId(null);
        if (addToPlaylistTrackId) return setAddToPlaylistTrackId(null);

        const { isQueueOpen, setQueueOpen } = usePlayerStore.getState();
        if (isQueueOpen) return setQueueOpen(false);

        return;
      }

      // If user is currently typing in an input or textarea, DO NOT intercept!
      if (isInput) return;

      // Toggle synchronized lyrics (Ctrl+L or Cmd+L)
      if ((e.ctrlKey || e.metaKey) && e.code === 'KeyL') {
        e.preventDefault();
        useLyricsStore.getState().toggleLyrics();
        return;
      }

      const playerState = usePlayerStore.getState();
      const progressState = useProgressStore.getState();
      const uiState = useUiStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          playerState.togglePlay();
          break;

        case 'KeyK':
          e.preventDefault();
          playerState.togglePlay();
          break;

        case 'KeyJ':
          // Seek back 5 seconds
          e.preventDefault();
          progressState.requestSeek(Math.max(0, progressState.currentTime - 5));
          break;

        case 'KeyL':
          // Seek forward 5 seconds
          e.preventDefault();
          progressState.requestSeek(Math.min(progressState.duration, progressState.currentTime + 5));
          break;

        case 'ArrowLeft':
          e.preventDefault();
          progressState.requestSeek(Math.max(0, progressState.currentTime - 5));
          break;

        case 'ArrowRight':
          e.preventDefault();
          progressState.requestSeek(Math.min(progressState.duration, progressState.currentTime + 5));
          break;

        case 'ArrowUp':
          // Volume up
          e.preventDefault();
          playerState.setVolume(Math.min(1, playerState.volume + 0.05));
          break;

        case 'ArrowDown':
          // Volume down
          e.preventDefault();
          playerState.setVolume(Math.max(0, playerState.volume - 0.05));
          break;

        case 'KeyM':
          e.preventDefault();
          playerState.toggleMute();
          break;

        case 'KeyS':
          e.preventDefault();
          playerState.toggleShuffle();
          break;

        case 'KeyR':
          e.preventDefault();
          playerState.cycleRepeatMode();
          break;

        case 'KeyQ':
          e.preventDefault();
          playerState.toggleQueue();
          break;

        case 'KeyN':
          if (e.shiftKey) {
            e.preventDefault();
            playerState.nextTrack();
          }
          break;

        case 'KeyP':
          if (e.shiftKey) {
            e.preventDefault();
            playerState.prevTrack();
          }
          break;

        case 'Slash':
          if (e.shiftKey) {
            // '?' key
            e.preventDefault();
            uiState.setShortcutsOpen(!uiState.isShortcutsOpen);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
