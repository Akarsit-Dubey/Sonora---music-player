import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import { useUiStore } from '../store/uiStore';
import { TRACKS } from '../data/tracks';
import { TrackTable } from '../components/library/TrackTable';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Button } from '../components/ui/Button';
import { Play, Shuffle, Edit3, Trash2, Clock, ListMusic } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

export const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getPlaylistById = useLibraryStore((s) => s.getPlaylistById);
  const removeTrackFromPlaylist = useLibraryStore((s) => s.removeTrackFromPlaylist);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const shufflePlay = usePlayerStore((s) => s.shufflePlay);

  const setEditingId = useUiStore((s) => s.setEditingPlaylistId);
  const setDeleteConfirmId = useUiStore((s) => s.setDeletePlaylistConfirmId);

  const playlist = id ? getPlaylistById(id) : undefined;

  if (!playlist) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Playlist not found</h2>
        <p className="text-sm text-[#8F9BAE]">
          The playlist you are looking for may have been deleted or does not exist.
        </p>
        <Button variant="secondary" onClick={() => navigate('/library')}>
          Back to Library
        </Button>
      </div>
    );
  }

  // Resolve tracks
  const tracks = playlist.trackIds
    .map((tid) => TRACKS.find((t) => t.id === tid))
    .filter((t): t is typeof TRACKS[0] => t !== undefined);

  const totalDuration = tracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0].id, playlist.trackIds);
    }
  };

  const handleShufflePlay = () => {
    shufflePlay(playlist.trackIds);
  };

  const handleRemoveTrack = (trackId: string) => {
    if (id) {
      removeTrackFromPlaylist(id, trackId);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Editorial Playlist Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#18202E]/90 to-[#0F141C] border border-[#232F42] shadow-2xl">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-[#2D394E]">
          <ArtworkImage
            src={playlist.coverUrl}
            alt={playlist.title}
            id={playlist.id}
            title={playlist.title}
            size="full"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18202D] text-[#D4FF00] text-xs font-mono font-semibold">
            <ListMusic size={13} /> {playlist.isUserCreated ? 'USER PLAYLIST' : 'EDITORIAL COMPILATION'}
          </span>

          <h1 className="text-2xl md:text-5xl font-display font-bold text-white tracking-tight">
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="text-xs md:text-sm text-[#8F9BAE] max-w-2xl leading-relaxed">
              {playlist.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-[#9CA3AF] pt-1">
            <span>By <strong className="text-[#F3F5F7]">{playlist.curator || 'You'}</strong></span>
            <span>•</span>
            <span>{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock size={12} /> {formatTime(totalDuration)} total
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button
              variant="primary"
              size="md"
              disabled={tracks.length === 0}
              onClick={handlePlayAll}
              icon={<Play size={16} className="fill-black" />}
            >
              Play
            </Button>

            <Button
              variant="secondary"
              size="md"
              disabled={tracks.length === 0}
              onClick={handleShufflePlay}
              icon={<Shuffle size={16} />}
            >
              Shuffle
            </Button>

            {playlist.isUserCreated && (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setEditingId(playlist.id)}
                  icon={<Edit3 size={15} />}
                >
                  Edit Details
                </Button>

                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setDeleteConfirmId(playlist.id)}
                  icon={<Trash2 size={15} />}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Track Table */}
      <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
        <TrackTable
          tracks={tracks}
          playlistContext={playlist.trackIds}
          emptyMessage="This playlist is currently empty. Add tracks from Search, Discover, or your Library."
          onRemoveFromPlaylist={playlist.isUserCreated ? handleRemoveTrack : undefined}
        />
      </div>
    </div>
  );
};
