import React from 'react';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import { TRACKS } from '../data/tracks';
import { TrackTable } from '../components/library/TrackTable';
import { Button } from '../components/ui/Button';
import { Heart, Play, Shuffle, Clock, Music2 } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

export const LikedSongsPage: React.FC = () => {
  const likedTrackIds = useLibraryStore((s) => s.likedTrackIds);
  const playTrack = usePlayerStore((s) => s.playTrack);
  const shufflePlay = usePlayerStore((s) => s.shufflePlay);

  const likedTracks = likedTrackIds
    .map((tid) => TRACKS.find((t) => t.id === tid))
    .filter((t): t is typeof TRACKS[0] => t !== undefined);

  const totalDuration = likedTracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (likedTracks.length > 0) {
      playTrack(likedTracks[0].id, likedTrackIds);
    }
  };

  const handleShufflePlay = () => {
    shufflePlay(likedTrackIds);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Editorial Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#1C2C1C] via-[#121915] to-[#0D120F] border border-[#27462A] shadow-2xl">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-gradient-to-br from-[#D4FF00] to-[#65A30D] flex items-center justify-center shadow-2xl flex-shrink-0">
          <Heart size={72} fill="black" className="text-black" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4FF00]/15 border border-[#D4FF00]/30 text-[#D4FF00] text-xs font-mono font-semibold">
            <Music2 size={13} /> SAVED COLLECTION
          </span>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Liked Songs
          </h1>

          <p className="text-xs md:text-sm text-[#9CA3AF] max-w-xl">
            Your personal frequency of cherished tracks. Saved automatically across sessions.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-[#9CA3AF] pt-1">
            <span>By <strong className="text-[#F3F5F7]">You</strong></span>
            <span>•</span>
            <span>{likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock size={12} /> {formatTime(totalDuration)} total
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button
              variant="primary"
              size="md"
              disabled={likedTracks.length === 0}
              onClick={handlePlayAll}
              icon={<Play size={16} className="fill-black" />}
            >
              Play Liked Songs
            </Button>

            <Button
              variant="secondary"
              size="md"
              disabled={likedTracks.length === 0}
              onClick={handleShufflePlay}
              icon={<Shuffle size={16} />}
            >
              Shuffle
            </Button>
          </div>
        </div>
      </div>

      {/* Liked Track Table */}
      <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
        <TrackTable
          tracks={likedTracks}
          playlistContext={likedTrackIds}
          emptyMessage="You haven't liked any songs yet. Click the heart icon on any song to add it here."
        />
      </div>
    </div>
  );
};
