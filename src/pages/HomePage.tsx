import React from 'react';
import { TRACKS } from '../data/tracks';
import { ALBUMS } from '../data/albums';
import { GENRES } from '../data/genres';
import { useLibraryStore } from '../store/libraryStore';
import { usePlayerStore } from '../store/playerStore';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { TrackRow } from '../components/library/TrackRow';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Button } from '../components/ui/Button';
import { Play, Sparkles, Disc, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return 'Late Night Frequencies';
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const playlists = useLibraryStore((s) => s.playlists);
  const recentlyPlayedIds = useLibraryStore((s) => s.recentlyPlayedIds);
  const playTrack = usePlayerStore((s) => s.playTrack);

  const featuredAlbum = ALBUMS[0]; // Synthetic Dawn
  const featuredTracks = TRACKS.filter((t) => featuredAlbum.trackIds.includes(t.id));

  // Resolved recently played
  const recentTracks = recentlyPlayedIds
    .map((id) => TRACKS.find((t) => t.id === id))
    .filter((t): t is typeof TRACKS[0] => t !== undefined)
    .slice(0, 5);

  const greeting = getGreeting();

  const handlePlayFeatured = () => {
    if (featuredTracks.length > 0) {
      playTrack(featuredTracks[0].id, featuredAlbum.trackIds);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Greeting Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF00] font-semibold flex items-center gap-1.5 mb-1">
            <Sparkles size={14} /> Curated for you
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#F3F5F7]">
            {greeting}
          </h1>
        </div>
      </div>

      {/* Featured Editorial Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#172030] via-[#121620] to-[#0D1016] border border-[#232F42] p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 group">
        <div className="relative flex-shrink-0 w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-[#2B384E]">
          <ArtworkImage
            src={featuredAlbum.coverUrl}
            alt={featuredAlbum.title}
            id={featuredAlbum.id}
            title={featuredAlbum.title}
            size="full"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-[#D4FF00] text-xs font-mono font-semibold">
            <Disc size={13} /> FEATURED ALBUM
          </div>

          <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">
            {featuredAlbum.title}
          </h2>

          <p className="text-sm font-medium text-[#9CA3AF]">
            By{' '}
            <Link
              to={`/artist/${featuredAlbum.artistId}`}
              className="text-[#F3F5F7] hover:text-[#D4FF00] underline underline-offset-4 font-semibold"
            >
              {featuredAlbum.artistName}
            </Link>{' '}
            • {featuredAlbum.genre} • {featuredAlbum.releaseYear}
          </p>

          <p className="text-xs md:text-sm text-[#8F9BAE] max-w-xl leading-relaxed">
            {featuredAlbum.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={handlePlayFeatured}
              icon={<Play size={16} className="fill-black" />}
            >
              Play Album
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate(`/album/${featuredAlbum.id}`)}
            >
              View Album Details
            </Button>
          </div>
        </div>
      </div>

      {/* Recently Played / Instant Rotation */}
      {recentTracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#F3F5F7]">Recently Played</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {recentTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track.id)}
                className="group flex items-center gap-3 p-2 rounded-xl bg-[#121620]/90 hover:bg-[#192230] border border-[#1C2534] hover:border-[#2D3C52] transition-all cursor-pointer shadow"
              >
                <ArtworkImage
                  src={track.artworkUrl}
                  alt={track.title}
                  id={track.id}
                  title={track.title}
                  size="sm"
                  className="rounded-lg"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#F3F5F7] group-hover:text-[#D4FF00] truncate">
                    {track.title}
                  </p>
                  <p className="text-xs text-[#8F9BAE] truncate">
                    {track.artistName}
                  </p>
                </div>
                <button
                  aria-label={`Play ${track.title}`}
                  className="w-8 h-8 rounded-full bg-[#D4FF00] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow mr-1 flex-shrink-0 cursor-pointer"
                >
                  <Play size={13} className="fill-black ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Curated Editorial Playlists Shelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#F3F5F7]">Curated Playlists</h3>
            <p className="text-xs text-[#8F9BAE]">Hand-selected vibes and sonic frequencies</p>
          </div>
          <Link
            to="/discover"
            className="text-xs font-semibold text-[#D4FF00] hover:underline flex items-center gap-1"
          >
            Explore all <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.slice(0, 5).map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </section>

      {/* Featured Tracks Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#F3F5F7]">Recommended Frequency</h3>
            <p className="text-xs text-[#8F9BAE]">Highest rated releases in the SONORA library</p>
          </div>
        </div>

        <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
          <div className="space-y-0.5">
            {TRACKS.slice(0, 6).map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={TRACKS.map((t) => t.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Browse Mood & Genre */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#F3F5F7]">Browse Moods & Frequencies</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {GENRES.slice(0, 4).map((genre) => (
            <Link
              key={genre.id}
              to={`/search?genre=${encodeURIComponent(genre.name)}`}
              className={`p-4 rounded-2xl bg-gradient-to-br ${genre.gradient} border backdrop-blur-md hover:scale-[1.02] transition-transform`}
            >
              <h4 className="font-bold text-sm text-white">{genre.name}</h4>
              <p className="text-[11px] text-white/70 mt-1 line-clamp-2">
                {genre.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
