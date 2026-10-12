import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { BottomPlayer } from '../player/BottomPlayer';
import { QueueDrawer } from '../player/QueueDrawer';
import { AudioEngine } from '../player/AudioEngine';
import { CreatePlaylistModal } from '../playlists/CreatePlaylistModal';
import { EditPlaylistModal } from '../playlists/EditPlaylistModal';
import { AddToPlaylistModal } from '../playlists/AddToPlaylistModal';
import { KeyboardShortcutsModal } from '../ui/KeyboardShortcutsModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ToastContainer } from '../ui/ToastContainer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useUiStore } from '../../store/uiStore';
import { useLibraryStore } from '../../store/libraryStore';

export const AppLayout: React.FC = () => {
  useKeyboardShortcuts();

  const deleteConfirmId = useUiStore((s) => s.deletePlaylistConfirmId);
  const setDeleteConfirmId = useUiStore((s) => s.setDeletePlaylistConfirmId);
  const deletePlaylist = useLibraryStore((s) => s.deletePlaylist);
  const addToast = useUiStore((s) => s.addToast);

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deletePlaylist(deleteConfirmId);
      addToast('Playlist deleted', 'The playlist has been removed from your library.', 'info');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0D11] text-[#F3F5F7]">
      {/* Headless persistent audio element */}
      <AudioEngine />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto pb-36 md:pb-28 px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>

      {/* Persistent Bottom Controls */}
      <BottomPlayer />

      {/* Queue Drawer overlay */}
      <QueueDrawer />

      {/* Mobile docked nav */}
      <MobileNav />

      {/* Modals & Dialogs */}
      <CreatePlaylistModal />
      <EditPlaylistModal />
      <AddToPlaylistModal />
      <KeyboardShortcutsModal />
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Playlist?"
        message="Are you sure you want to delete this playlist? This action cannot be undone."
        confirmLabel="Delete Playlist"
        isDestructive={true}
      />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
};
