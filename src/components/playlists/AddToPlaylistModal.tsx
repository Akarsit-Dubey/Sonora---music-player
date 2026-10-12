import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useUiStore } from '../../store/uiStore';
import { useLibraryStore } from '../../store/libraryStore';
import { TRACKS } from '../../data/tracks';
import { Plus, Check, ListMusic } from 'lucide-react';

export const AddToPlaylistModal: React.FC = () => {
  const trackId = useUiStore((s) => s.addToPlaylistTrackId);
  const setTrackId = useUiStore((s) => s.setAddToPlaylistTrackId);
  const setCreateOpen = useUiStore((s) => s.setCreatePlaylistOpen);
  const addToast = useUiStore((s) => s.addToast);

  const playlists = useLibraryStore((s) => s.playlists);
  const addTrackToPlaylist = useLibraryStore((s) => s.addTrackToPlaylist);

  const track = TRACKS.find((t) => t.id === trackId);

  if (!trackId || !track) return null;

  const handleSelectPlaylist = (playlistId: string, playlistTitle: string) => {
    const success = addTrackToPlaylist(playlistId, track.id);
    if (success) {
      addToast('Added to playlist', `"${track.title}" added to "${playlistTitle}".`, 'success');
    } else {
      addToast('Already in playlist', `"${track.title}" is already in this playlist.`, 'info');
    }
    setTrackId(null);
  };

  const handleNewPlaylist = () => {
    setTrackId(null);
    setCreateOpen(true);
  };

  return (
    <Modal
      isOpen={!!trackId}
      onClose={() => setTrackId(null)}
      title="Add to Playlist"
      description={`Choose a playlist for "${track.title}" by ${track.artistName}`}
      maxWidth="sm"
    >
      <div className="space-y-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewPlaylist}
          className="w-full justify-start gap-2 border-dashed border-[#3A455A] hover:border-[#D4FF00] hover:text-[#D4FF00] py-2.5"
          icon={<Plus size={16} />}
        >
          Create New Playlist
        </Button>

        <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
          {playlists.map((playlist) => {
            const alreadyIn = playlist.trackIds.includes(track.id);

            return (
              <button
                key={playlist.id}
                onClick={() => handleSelectPlaylist(playlist.id, playlist.title)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1A212E] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#222B3A] flex items-center justify-center flex-shrink-0 text-[#9CA3AF] group-hover:text-[#D4FF00]">
                    <ListMusic size={16} />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium text-[#F3F5F7] group-hover:text-white truncate">
                      {playlist.title}
                    </p>
                    <p className="text-xs text-[#6B7280]">
                      {playlist.trackIds.length} tracks
                    </p>
                  </div>
                </div>

                {alreadyIn ? (
                  <span className="flex items-center gap-1 text-xs text-[#D4FF00]">
                    <Check size={14} /> Added
                  </span>
                ) : (
                  <span className="text-xs text-[#6B7280] group-hover:text-[#F3F5F7] opacity-0 group-hover:opacity-100 transition-opacity">
                    Add
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
