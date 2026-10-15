import React, { useState } from 'react';
import type { Track } from '../../types/music';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import { ArtworkImage } from '../ui/ArtworkImage';
import { formatTime } from '../../utils/formatTime';
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  PlusCircle,
  ListPlus,
  Radio,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrackRowProps {
  track: Track;
  index: number;
  playlistContext?: string[];
  showAlbum?: boolean;
  showArtwork?: boolean;
  onRemoveFromPlaylist?: (trackId: string) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  playlistContext,
  showAlbum = true,
  showArtwork = true,
  onRemoveFromPlaylist,
}) => {
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const playNext = usePlayerStore((s) => s.playNext);

  const isLiked = useLibraryStore((s) => s.isLiked(track.id));
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);

  const setAddToPlaylistTrackId = useUiStore((s) => s.setAddToPlaylistTrackId);
  const addToast = useUiStore((s) => s.addToast);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isCurrent = currentTrackId === track.id;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track.id, playlistContext);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track.id);
    addToast('Added to queue', `"${track.title}" added to queue.`);
    setIsMenuOpen(false);
  };

  const handlePlayNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext(track.id);
    addToast('Playing next', `"${track.title}" will play next.`);
    setIsMenuOpen(false);
  };

  const handleOpenPlaylistModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAddToPlaylistTrackId(track.id);
    setIsMenuOpen(false);
  };

  const handleShareTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const textToCopy = `Listen to "${track.title}" by ${track.artistName} on SONORA: ${window.location.origin}/album/${track.albumId}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        addToast('Copied to clipboard', `"${track.title}" link ready to share.`, 'success');
      }).catch(() => {
        addToast('Track Info', `"${track.title}" by ${track.artistName}`, 'info');
      });
    } else {
      addToast('Track Info', `"${track.title}" by ${track.artistName}`, 'info');
    }
  };

  return (
    <div
      onClick={handlePlayClick}
      className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all select-none cursor-pointer ${
        isCurrent
          ? 'bg-[#18212E] text-[#D4FF00]'
          : 'hover:bg-[#141A24] text-[#F3F5F7]'
      }`}
    >
      {/* Index or Play / Equalizer */}
      <div className="w-8 flex items-center justify-center flex-shrink-0 text-xs font-mono text-[#6B7280]">
        <button
          onClick={handlePlayClick}
          aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
          className="hidden group-hover:flex items-center justify-center w-7 h-7 rounded-full text-white hover:text-[#D4FF00] hover:scale-110 transition-all cursor-pointer"
        >
          {isCurrent && isPlaying ? (
            <Pause size={14} className="fill-current" />
          ) : (
            <Play size={14} className="fill-current ml-0.5" />
          )}
        </button>

        <span className="group-hover:hidden">
          {isCurrent && isPlaying ? (
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-[#D4FF00] h-2 animate-[equalize_0.8s_ease-in-out_infinite_alternate]" />
              <span className="w-0.5 bg-[#D4FF00] h-3 animate-[equalize_1.1s_ease-in-out_infinite_alternate]" />
              <span className="w-0.5 bg-[#D4FF00] h-1.5 animate-[equalize_0.6s_ease-in-out_infinite_alternate]" />
            </span>
          ) : (
            <span className={isCurrent ? 'text-[#D4FF00] font-semibold' : ''}>
              {index + 1}
            </span>
          )}
        </span>
      </div>

      {/* Artwork */}
      {showArtwork && (
        <div className="flex-shrink-0">
          <ArtworkImage
            src={track.artworkUrl}
            alt={track.title}
            id={track.id}
            title={track.title}
            size="sm"
            className="rounded-lg shadow"
          />
        </div>
      )}

      {/* Title & Artist */}
      <div className="flex-1 min-w-0 pr-2">
        <p
          className={`text-sm font-semibold truncate ${
            isCurrent ? 'text-[#D4FF00]' : 'text-[#F3F5F7] group-hover:text-white'
          }`}
        >
          {track.title}
        </p>
        <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
          <Link
            to={`/artist/${track.artistId}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline hover:text-[#F3F5F7] transition-colors"
          >
            {track.artistName}
          </Link>
        </p>
      </div>

      {/* Album (hidden on small screens) */}
      {showAlbum && (
        <div className="hidden md:block flex-1 min-w-0 pr-2">
          <Link
            to={`/album/${track.albumId}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-[#9CA3AF] hover:text-[#F3F5F7] hover:underline transition-colors truncate block"
          >
            {track.albumTitle}
          </Link>
        </div>
      )}

      {/* Genre tag */}
      <div className="hidden lg:block w-28 text-left">
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#18202D] text-[#8F9BAE] border border-[#232D3F]">
          {track.genre}
        </span>
      </div>

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleLikeTrack(track.id);
        }}
        aria-label={isLiked ? 'Unlike track' : 'Like track'}
        className={`p-1.5 rounded-full transition-all cursor-pointer ${
          isLiked
            ? 'text-[#D4FF00]'
            : 'text-[#6B7280] opacity-0 group-hover:opacity-100 hover:text-white'
        }`}
      >
        <Heart size={16} fill={isLiked ? '#D4FF00' : 'none'} />
      </button>

      {/* Duration */}
      <span className="text-xs font-mono text-[#6B7280] w-11 text-right">
        {formatTime(track.duration)}
      </span>

      {/* Actions Menu */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="More track options"
          className="p-1.5 rounded-full text-[#6B7280] opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#1E2738] transition-all cursor-pointer"
        >
          <MoreHorizontal size={16} />
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
              }}
            />
            <div
              className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-[#141820] border border-[#263143] py-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100 text-xs text-[#F3F5F7]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleAddToQueue}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1E2635] text-left transition-colors cursor-pointer"
              >
                <PlusCircle size={14} className="text-[#9CA3AF]" />
                <span>Add to queue</span>
              </button>

              <button
                onClick={handlePlayNext}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1E2635] text-left transition-colors cursor-pointer"
              >
                <ListPlus size={14} className="text-[#9CA3AF]" />
                <span>Play next</span>
              </button>

              <button
                onClick={handleOpenPlaylistModal}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1E2635] text-left transition-colors cursor-pointer"
              >
                <Radio size={14} className="text-[#9CA3AF]" />
                <span>Add to playlist...</span>
              </button>

              <button
                onClick={handleShareTrack}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1E2635] text-left transition-colors cursor-pointer"
              >
                <Share2 size={14} className="text-[#9CA3AF]" />
                <span>Share track</span>
              </button>

              {onRemoveFromPlaylist && (
                <>
                  <div className="h-[1px] bg-[#232B3A] my-1" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromPlaylist(track.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 text-left transition-colors cursor-pointer"
                  >
                    <span>Remove from playlist</span>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
