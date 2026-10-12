import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { useLibraryStore } from '../../store/libraryStore';
import { TRACKS } from '../../data/tracks';
import { ArtworkImage } from '../ui/ArtworkImage';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { Tooltip } from '../ui/Tooltip';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BottomPlayer: React.FC = () => {
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const isBuffering = usePlayerStore((s) => s.isBuffering);
  const playbackError = usePlayerStore((s) => s.playbackError);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const isQueueOpen = usePlayerStore((s) => s.isQueueOpen);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const prevTrack = usePlayerStore((s) => s.prevTrack);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeatMode = usePlayerStore((s) => s.cycleRepeatMode);
  const toggleQueue = usePlayerStore((s) => s.toggleQueue);

  const isLiked = useLibraryStore((s) => (currentTrackId ? s.isLiked(currentTrackId) : false));
  const toggleLikeTrack = useLibraryStore((s) => s.toggleLikeTrack);

  const currentTrack = TRACKS.find((t) => t.id === currentTrackId);

  return (
    <footer
      role="region"
      aria-label="Audio player"
      className="fixed bottom-0 left-0 right-0 z-30 h-20 md:h-22 bg-[#0A0C10]/95 backdrop-blur-xl border-t border-[#1C2330] px-4 md:px-6 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
    >
      {/* Left: Track Information */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[280px]">
        {currentTrack ? (
          <>
            <Link to={`/album/${currentTrack.albumId}`} className="group relative flex-shrink-0">
              <ArtworkImage
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                id={currentTrack.id}
                title={currentTrack.title}
                size="md"
                className="rounded-lg shadow-md group-hover:brightness-110 transition-all"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                to={`/album/${currentTrack.albumId}`}
                className="block text-sm font-semibold text-[#F3F5F7] hover:text-[#D4FF00] hover:underline transition-colors truncate"
              >
                {currentTrack.title}
              </Link>
              <Link
                to={`/artist/${currentTrack.artistId}`}
                className="block text-xs text-[#9CA3AF] hover:text-[#E2E8F0] transition-colors truncate"
              >
                {currentTrack.artistName}
              </Link>
            </div>

            <Tooltip content={isLiked ? 'Remove from Liked' : 'Save to Liked Songs'}>
              <button
                onClick={() => currentTrack && toggleLikeTrack(currentTrack.id)}
                aria-label={isLiked ? 'Unlike song' : 'Like song'}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isLiked
                    ? 'text-[#D4FF00]'
                    : 'text-[#6B7280] hover:text-[#F3F5F7]'
                }`}
              >
                <Heart size={18} fill={isLiked ? '#D4FF00' : 'none'} />
              </button>
            </Tooltip>
          </>
        ) : (
          <div className="text-xs text-[#6B7280]">No track selected</div>
        )}
      </div>

      {/* Center: Controls and Progress Bar */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl px-2">
        <div className="flex items-center gap-4 md:gap-5 mb-1">
          {/* Shuffle */}
          <Tooltip content={shuffle ? 'Disable shuffle' : 'Enable shuffle'} shortcut="S">
            <button
              onClick={toggleShuffle}
              aria-label="Toggle shuffle"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                shuffle
                  ? 'text-[#D4FF00]'
                  : 'text-[#6B7280] hover:text-[#F3F5F7]'
              }`}
            >
              <Shuffle size={16} />
            </button>
          </Tooltip>

          {/* Previous Track */}
          <Tooltip content="Previous track" shortcut="Shift+P">
            <button
              onClick={() => prevTrack()}
              aria-label="Previous track"
              className="p-1.5 rounded-full text-[#9CA3AF] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <SkipBack size={19} />
            </button>
          </Tooltip>

          {/* Play / Pause Primary Action */}
          <Tooltip content={isPlaying ? 'Pause' : 'Play'} shortcut="Space">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#D4FF00] hover:bg-[#E2FF33] text-black flex items-center justify-center shadow-lg shadow-[#D4FF00]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isBuffering ? (
                <Loader2 size={20} className="animate-spin text-black" />
              ) : isPlaying ? (
                <Pause size={20} className="fill-black text-black" />
              ) : (
                <Play size={20} className="fill-black text-black ml-0.5" />
              )}
            </button>
          </Tooltip>

          {/* Next Track */}
          <Tooltip content="Next track" shortcut="Shift+N">
            <button
              onClick={nextTrack}
              aria-label="Next track"
              className="p-1.5 rounded-full text-[#9CA3AF] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              <SkipForward size={19} />
            </button>
          </Tooltip>

          {/* Repeat */}
          <Tooltip
            content={
              repeatMode === 'one'
                ? 'Repeat One (Click to disable)'
                : repeatMode === 'all'
                ? 'Repeat All (Click for Repeat One)'
                : 'Enable repeat'
            }
            shortcut="R"
          >
            <button
              onClick={cycleRepeatMode}
              aria-label="Cycle repeat mode"
              className={`p-1.5 rounded-full transition-colors cursor-pointer relative ${
                repeatMode !== 'off'
                  ? 'text-[#D4FF00]'
                  : 'text-[#6B7280] hover:text-[#F3F5F7]'
              }`}
            >
              {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={16} />}
              {repeatMode !== 'off' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4FF00] rounded-full" />
              )}
            </button>
          </Tooltip>
        </div>

        {/* Playback Error Warning if any */}
        {playbackError && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mb-0.5">
            <AlertCircle size={12} />
            <span>{playbackError}</span>
          </div>
        )}

        {/* Progress Seeker */}
        <ProgressBar />
      </div>

      {/* Right: Volume & Queue Toggle */}
      <div className="hidden sm:flex items-center justify-end gap-3 w-1/4 min-w-[180px] max-w-[280px]">
        <VolumeControl />

        <div className="h-4 w-[1px] bg-[#232B3A]" />

        <Tooltip content={isQueueOpen ? 'Close queue' : 'Open queue'} shortcut="Q">
          <button
            onClick={toggleQueue}
            aria-label="Toggle playback queue"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isQueueOpen
                ? 'text-[#D4FF00] bg-[#1E2738]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#18202D]'
            }`}
          >
            <ListMusic size={18} />
          </button>
        </Tooltip>
      </div>
    </footer>
  );
};
