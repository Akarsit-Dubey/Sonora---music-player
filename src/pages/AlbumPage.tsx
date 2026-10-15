import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ALBUMS } from '../data/albums';
import { TRACKS } from '../data/tracks';
import { usePlayerStore } from '../store/playerStore';
import { useUiStore } from '../store/uiStore';
import { TrackTable } from '../components/library/TrackTable';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Button } from '../components/ui/Button';
import { Play, Shuffle, Disc, Clock, Share2 } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

export const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playTrack = usePlayerStore((s) => s.playTrack);
  const shufflePlay = usePlayerStore((s) => s.shufflePlay);
  const addToast = useUiStore((s) => s.addToast);

  const album = ALBUMS.find((a) => a.id === id);

  const handleShareAlbum = () => {
    if (!album) return;
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        addToast('Link Copied', `"${album.title}" by ${album.artistName} copied to clipboard.`, 'success');
      }).catch(() => {
        addToast('Share Album', `${album.title} by ${album.artistName}`, 'info');
      });
    } else {
      addToast('Share Album', `${album.title} by ${album.artistName}`, 'info');
    }
  };

  if (!album) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Album not found</h2>
        <Button variant="secondary" onClick={() => navigate('/library')}>
          Back to Library
        </Button>
      </div>
    );
  }

  const albumTracks = album.trackIds
    .map((tid) => TRACKS.find((t) => t.id === tid))
    .filter((t): t is typeof TRACKS[0] => t !== undefined);

  const totalDuration = albumTracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAlbum = () => {
    if (albumTracks.length > 0) {
      playTrack(albumTracks[0].id, album.trackIds);
    }
  };

  const handleShuffleAlbum = () => {
    shufflePlay(album.trackIds);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Editorial Album Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#18202E]/90 to-[#0F141C] border border-[#232F42] shadow-2xl">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-[#2D394E]">
          <ArtworkImage
            src={album.coverUrl}
            alt={album.title}
            id={album.id}
            title={album.title}
            size="full"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18202D] text-[#D4FF00] text-xs font-mono font-semibold">
            <Disc size={13} /> ALBUM RELEASE
          </span>

          <h1 className="text-2xl md:text-5xl font-display font-bold text-white tracking-tight">
            {album.title}
          </h1>

          <p className="text-xs md:text-sm text-[#8F9BAE] max-w-2xl leading-relaxed">
            {album.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-[#9CA3AF] pt-1">
            <span>
              By{' '}
              <Link
                to={`/artist/${album.artistId}`}
                className="text-[#F3F5F7] hover:text-[#D4FF00] font-semibold underline underline-offset-2"
              >
                {album.artistName}
              </Link>
            </span>
            <span>•</span>
            <span>{album.releaseYear}</span>
            <span>•</span>
            <span>{album.genre}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock size={12} /> {formatTime(totalDuration)}
            </span>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button
              variant="primary"
              size="md"
              disabled={albumTracks.length === 0}
              onClick={handlePlayAlbum}
              icon={<Play size={16} className="fill-black" />}
            >
              Play Album
            </Button>

            <Button
              variant="secondary"
              size="md"
              disabled={albumTracks.length === 0}
              onClick={handleShuffleAlbum}
              icon={<Shuffle size={16} />}
            >
              Shuffle
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleShareAlbum}
              icon={<Share2 size={15} />}
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Album Track Table */}
      <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
        <TrackTable
          tracks={albumTracks}
          playlistContext={album.trackIds}
          showAlbum={false}
          emptyMessage="No tracks in this album."
        />
      </div>
    </div>
  );
};
