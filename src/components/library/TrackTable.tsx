import React from 'react';
import type { Track } from '../../types/music';
import { TrackRow } from './TrackRow';
import { Clock3 } from 'lucide-react';

interface TrackTableProps {
  tracks: Track[];
  playlistContext?: string[];
  showAlbum?: boolean;
  emptyMessage?: string;
  onRemoveFromPlaylist?: (trackId: string) => void;
}

export const TrackTable: React.FC<TrackTableProps> = ({
  tracks,
  playlistContext,
  showAlbum = true,
  emptyMessage = 'No tracks found.',
  onRemoveFromPlaylist,
}) => {
  if (tracks.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-[#6B7280] rounded-2xl bg-[#0E1218]/40 border border-[#1A222F]">
        {emptyMessage}
      </div>
    );
  }

  const contextIds = playlistContext || tracks.map((t) => t.id);

  return (
    <div className="w-full">
      {/* Table column headers */}
      <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider border-b border-[#1E2635] mb-1">
        <div className="w-8 text-center flex-shrink-0">#</div>
        <div className="w-10 min-w-10 flex-shrink-0" />
        <div className="flex-1 min-w-0 pr-2">Title</div>
        {showAlbum && <div className="hidden md:block flex-1 min-w-0 pr-2">Album</div>}
        <div className="hidden lg:block w-28 text-left">Genre</div>
        <div className="w-6" />
        <div className="w-11 text-right flex items-center justify-end">
          <Clock3 size={14} />
        </div>
        <div className="w-6" />
      </div>

      {/* Track rows */}
      <div className="space-y-0.5">
        {tracks.map((track, idx) => (
          <TrackRow
            key={`${track.id}-${idx}`}
            track={track}
            index={idx}
            playlistContext={contextIds}
            showAlbum={showAlbum}
            onRemoveFromPlaylist={onRemoveFromPlaylist}
          />
        ))}
      </div>
    </div>
  );
};
