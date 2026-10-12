import React from 'react';
import type { Playlist } from '../../types/music';
import { ArtworkImage } from '../ui/ArtworkImage';
import { usePlayerStore } from '../../store/playerStore';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();
  const playTrack = usePlayerStore((s) => s.playTrack);

  const handleCardClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.trackIds.length > 0) {
      playTrack(playlist.trackIds[0], playlist.trackIds);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col p-3 rounded-2xl bg-[#131720]/80 hover:bg-[#18202D] border border-[#1E2635] hover:border-[#2B374C] transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl"
    >
      {/* Artwork container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3">
        <ArtworkImage
          src={playlist.coverUrl}
          alt={playlist.title}
          id={playlist.id}
          title={playlist.title}
          size="full"
        />

        {/* Hover quick play button */}
        {playlist.trackIds.length > 0 && (
          <button
            onClick={handlePlayClick}
            aria-label={`Play ${playlist.title}`}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#D4FF00] hover:bg-[#E2FF33] text-black shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play size={18} className="fill-black ml-0.5" />
          </button>
        )}
      </div>

      {/* Info */}
      <h4 className="font-semibold text-sm text-[#F3F5F7] group-hover:text-white truncate">
        {playlist.title}
      </h4>
      <p className="text-xs text-[#9CA3AF] line-clamp-2 mt-1 min-h-[2rem]">
        {playlist.description || `${playlist.trackIds.length} tracks • By ${playlist.curator || 'You'}`}
      </p>
    </div>
  );
};
