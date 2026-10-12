import React, { useState } from 'react';
import { TRACKS } from '../data/tracks';
import { ARTISTS } from '../data/artists';
import { ALBUMS } from '../data/albums';
import { GENRES } from '../data/genres';
import { useLibraryStore } from '../store/libraryStore';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { TrackRow } from '../components/library/TrackRow';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Compass, Users, Sparkles, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DiscoverPage: React.FC = () => {
  const playlists = useLibraryStore((s) => s.playlists);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredTracks = selectedGenre
    ? TRACKS.filter((t) => t.genre.toLowerCase() === selectedGenre.toLowerCase())
    : TRACKS;

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18202D] text-[#D4FF00] text-xs font-mono font-semibold mb-2">
          <Compass size={14} /> EXPLORATION
        </div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">
          Discover Soundscapes
        </h1>
        <p className="text-sm text-[#9CA3AF] mt-1">
          Explore curated releases, visionary sound architects, and genre frequencies.
        </p>
      </div>

      {/* Featured Artists Horizon */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F3F5F7] flex items-center gap-2">
            <Users size={18} className="text-[#D4FF00]" /> Featured Artists
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {ARTISTS.map((artist) => (
            <Link
              key={artist.id}
              to={`/artist/${artist.id}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl bg-[#121620]/60 hover:bg-[#18212E] border border-[#1E2635] hover:border-[#2C384D] transition-all"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-[#D4FF00] shadow-lg transition-colors">
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="font-semibold text-xs text-[#F3F5F7] group-hover:text-[#D4FF00] truncate w-full">
                {artist.name}
              </h4>
              <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mt-0.5">
                {artist.genres[0]}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Genre / Mood Interactive Filter */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F3F5F7] flex items-center gap-2">
            <Filter size={18} className="text-[#D4FF00]" /> Filter by Frequency
          </h2>
          {selectedGenre && (
            <button
              onClick={() => setSelectedGenre(null)}
              className="text-xs text-[#D4FF00] hover:underline cursor-pointer"
            >
              Clear filter ({selectedGenre})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenre === null
                ? 'bg-[#D4FF00] text-black shadow-md'
                : 'bg-[#141820] text-[#9CA3AF] hover:text-white border border-[#212A3A]'
            }`}
          >
            All Genres ({TRACKS.length})
          </button>
          {GENRES.map((g) => {
            const count = TRACKS.filter(
              (t) => t.genre.toLowerCase() === g.name.toLowerCase()
            ).length;
            const isSelected = selectedGenre?.toLowerCase() === g.name.toLowerCase();

            return (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(isSelected ? null : g.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4FF00] text-black shadow-md'
                    : 'bg-[#141820] text-[#9CA3AF] hover:text-white border border-[#212A3A]'
                }`}
              >
                {g.name} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Tracks matching selected genre */}
        <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
          <div className="space-y-0.5">
            {filteredTracks.map((track, idx) => (
              <TrackRow
                key={track.id}
                track={track}
                index={idx}
                playlistContext={filteredTracks.map((t) => t.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Albums Carousel / Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#F3F5F7] flex items-center gap-2">
          <Sparkles size={18} className="text-[#D4FF00]" /> Notable Albums
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {ALBUMS.map((album) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="group flex flex-col p-3 rounded-2xl bg-[#121620]/80 hover:bg-[#18212E] border border-[#1E2635] hover:border-[#2C384D] transition-all"
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
                {album.artistName} • {album.releaseYear}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Editorial Playlists */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#F3F5F7]">Curated Compilations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      </section>
    </div>
  );
};
