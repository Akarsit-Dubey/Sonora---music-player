import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { TRACKS } from '../../data/tracks';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Button } from '../ui/Button';
import { X, Trash2, Play, Music2 } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';

export const QueueDrawer: React.FC = () => {
  const isQueueOpen = usePlayerStore((s) => s.isQueueOpen);
  const setQueueOpen = usePlayerStore((s) => s.setQueueOpen);
  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const queue = usePlayerStore((s) => s.queue);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const clearQueue = usePlayerStore((s) => s.clearQueue);
  const jumpToQueueIndex = usePlayerStore((s) => s.jumpToQueueIndex);

  if (!isQueueOpen) return null;

  const currentTrack = TRACKS.find((t) => t.id === currentTrackId);
  const currentQueueIndex = currentTrackId ? queue.indexOf(currentTrackId) : -1;
  const upcomingQueue = currentQueueIndex >= 0 ? queue.slice(currentQueueIndex + 1) : queue;

  const upcomingTracks = upcomingQueue
    .map((tid) => TRACKS.find((t) => t.id === tid))
    .filter((t): t is typeof TRACKS[0] => t !== undefined);
  const totalUpcomingDuration = upcomingTracks.reduce((acc, t) => acc + t.duration, 0);

  return (
    <div
      role="region"
      aria-label="Playback queue"
      className="fixed bottom-24 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] max-h-[75vh] flex flex-col rounded-2xl bg-[#11151D]/95 backdrop-blur-xl border border-[#232C3D] shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1E2635]">
        <div className="flex items-center gap-2">
          <Music2 size={18} className="text-[#D4FF00]" />
          <h3 className="font-semibold text-sm text-[#F3F5F7]">Play Queue</h3>
          <span className="text-xs text-[#6B7280]">
            ({queue.length} {queue.length === 1 ? 'track' : 'tracks'})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {upcomingQueue.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQueue}
              className="text-xs text-[#9CA3AF] hover:text-red-400 py-1 px-2.5"
              icon={<Trash2 size={13} />}
            >
              Clear
            </Button>
          )}
          <button
            onClick={() => setQueueOpen(false)}
            aria-label="Close queue"
            className="p-1.5 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1E2533] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Currently Playing Card */}
        {currentTrack && (
          <div>
            <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider px-2 block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#18202D] border border-[#2A3549]/70 relative overflow-hidden group">
              <div className="relative">
                <ArtworkImage
                  src={currentTrack.artworkUrl}
                  alt={currentTrack.title}
                  id={currentTrack.id}
                  title={currentTrack.title}
                  size="sm"
                  className="rounded-lg"
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <span className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 bg-[#D4FF00] h-2 animate-[equalize_0.8s_ease-in-out_infinite_alternate]" />
                      <span className="w-0.5 bg-[#D4FF00] h-3 animate-[equalize_1.1s_ease-in-out_infinite_alternate]" />
                      <span className="w-0.5 bg-[#D4FF00] h-1.5 animate-[equalize_0.6s_ease-in-out_infinite_alternate]" />
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#D4FF00] truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-[#9CA3AF] truncate">
                  {currentTrack.artistName}
                </p>
              </div>

              <span className="text-xs font-mono text-[#6B7280]">
                {formatTime(currentTrack.duration)}
              </span>
            </div>
          </div>
        )}

        {/* Next Up List */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
              Next in Queue ({upcomingQueue.length})
            </span>
            {upcomingQueue.length > 0 && (
              <span className="text-[11px] font-mono text-[#D4FF00]/80">
                {formatTime(totalUpcomingDuration)} remaining
              </span>
            )}
          </div>

          {upcomingQueue.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280] text-xs">
              No upcoming tracks. Queue will stop when current track ends.
            </div>
          ) : (
            <div className="space-y-1">
              {upcomingQueue.map((trackId, idx) => {
                const track = TRACKS.find((t) => t.id === trackId);
                if (!track) return null;
                const absoluteQueueIndex = (currentQueueIndex >= 0 ? currentQueueIndex + 1 : 0) + idx;

                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#18202D] transition-colors group cursor-pointer"
                    onClick={() => jumpToQueueIndex(absoluteQueueIndex)}
                  >
                    <div className="relative flex-shrink-0">
                      <ArtworkImage
                        src={track.artworkUrl}
                        alt={track.title}
                        id={track.id}
                        title={track.title}
                        size="sm"
                        className="rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                        <Play size={14} className="text-[#D4FF00] fill-[#D4FF00]" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#F3F5F7] group-hover:text-white truncate">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {track.artistName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6B7280]">
                        {formatTime(track.duration)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(absoluteQueueIndex);
                        }}
                        aria-label={`Remove ${track.title} from queue`}
                        className="p-1 rounded text-[#6B7280] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
