import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ARTISTS } from '../data/artists';
import { TRACKS } from '../data/tracks';
import { ALBUMS } from '../data/albums';
import { usePlayerStore } from '../store/playerStore';
import { TrackTable } from '../components/library/TrackTable';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Button } from '../components/ui/Button';
import { Play, Disc } from 'lucide-react';

export const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playTrack = usePlayerStore((s) => s.playTrack);

  const artist = ARTISTS.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Artist not found</h2>
        <Button variant="secondary" onClick={() => navigate('/discover')}>
          Back to Discover
        </Button>
      </div>
    );
  }

  const artistTracks = TRACKS.filter((t) => t.artistId === artist.id);
  const artistAlbums = ALBUMS.filter((al) => al.artistId === artist.id);

  const handlePlayArtist = () => {
    if (artistTracks.length > 0) {
      playTrack(artistTracks[0].id, artistTracks.map((t) => t.id));
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Hero Banner with Parallax Background */}
      <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex flex-col justify-end p-6 md:p-10 border border-[#232F42] shadow-2xl">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={artist.bannerUrl}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-[#0B0D11]/70 to-transparent" />
        </div>

        {/* Artist Profile Details */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <img
            src={artist.avatarUrl}
            alt={artist.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#0B0D11] shadow-2xl flex-shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00] text-black text-[11px] font-bold uppercase tracking-wider">
                Verified Artist
              </span>
              <span className="text-xs text-[#9CA3AF] font-mono">
                {artist.monthlyListeners.toLocaleString()} monthly listeners
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs md:text-sm text-[#CBD5E1] max-w-2xl leading-relaxed">
              {artist.bio}
            </p>

            <div className="pt-2 flex items-center justify-center md:justify-start gap-3">
              <Button
                variant="primary"
                size="md"
                disabled={artistTracks.length === 0}
                onClick={handlePlayArtist}
                icon={<Play size={16} className="fill-black" />}
              >
                Play Popular
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tracks Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Popular Releases
        </h2>

        <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
          <TrackTable
            tracks={artistTracks}
            playlistContext={artistTracks.map((t) => t.id)}
            emptyMessage="No tracks found for this artist."
          />
        </div>
      </section>

      {/* Artist Discography */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Disc size={18} className="text-[#D4FF00]" /> Albums & EPs
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {artistAlbums.map((album) => (
              <Link
                key={album.id}
                to={`/album/${album.id}`}
                className="group flex flex-col p-3 rounded-2xl bg-[#121620] hover:bg-[#18212E] border border-[#1E2635] hover:border-[#2C384D] transition-all"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden mb-3">
                  <ArtworkImage
                    src={album.coverUrl}
                    alt={album.title}
                    id={album.id}
                    title={album.title}
                    size="full"
                  />
                </div>
                <h4 className="font-semibold text-sm text-[#F3F5F7] group-hover:text-[#D4FF00] truncate">
                  {album.title}
                </h4>
                <p className="text-xs text-[#8F9BAE] truncate mt-0.5">
                  {album.releaseYear} • {album.trackIds.length} tracks
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
