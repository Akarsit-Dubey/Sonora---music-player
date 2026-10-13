import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { TRACKS } from '../data/tracks';
import { ARTISTS } from '../data/artists';
import { ALBUMS } from '../data/albums';
import { GENRES } from '../data/genres';
import { TrackTable } from '../components/library/TrackTable';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Search as SearchIcon, X, Music, Users, Disc, Radio } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('genre') || '';

  const handleQueryChange = (val: string) => {
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchParams({});
  };

  const trimmed = query.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!trimmed) {
      return { tracks: [], artists: [], albums: [], hasResults: false };
    }

    const matchedTracks = TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(trimmed) ||
        t.artistName.toLowerCase().includes(trimmed) ||
        t.albumTitle.toLowerCase().includes(trimmed) ||
        t.genre.toLowerCase().includes(trimmed)
    );

    const matchedArtists = ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(trimmed) ||
        a.genres.some((g) => g.toLowerCase().includes(trimmed))
    );

    const matchedAlbums = ALBUMS.filter(
      (al) =>
        al.title.toLowerCase().includes(trimmed) ||
        al.artistName.toLowerCase().includes(trimmed) ||
        al.genre.toLowerCase().includes(trimmed)
    );

    const hasResults =
      matchedTracks.length > 0 ||
      matchedArtists.length > 0 ||
      matchedAlbums.length > 0;

    return {
      tracks: matchedTracks,
      artists: matchedArtists,
      albums: matchedAlbums,
      hasResults,
    };
  }, [trimmed]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Prominent Search Input Header */}
      <div className="relative max-w-2xl">
        <div className="relative flex items-center">
          <SearchIcon
            size={20}
            className="absolute left-4 text-[#9CA3AF] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search tracks, artists, albums, or genres..."
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#141820] border border-[#232D3F] text-base text-[#F3F5F7] placeholder-[#636C7E] focus:outline-none focus:border-[#D4FF00] focus:ring-2 focus:ring-[#D4FF00]/20 shadow-xl transition-all"
          />
          {query && (
            <button
              onClick={handleClear}
              aria-label="Clear search query"
              className="absolute right-3.5 p-1 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1E2738] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* When query is empty: Browse Genres & Categories */}
      {!trimmed && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#F3F5F7] mb-1">
              Browse All Categories
            </h2>
            <p className="text-xs text-[#8F9BAE]">
              Jump directly into curated genre channels
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleQueryChange(g.name)}
                className={`p-5 rounded-2xl bg-gradient-to-br ${g.gradient} border text-left hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-white">{g.name}</h3>
                  <Radio size={16} className="text-white/60" />
                </div>
                <p className="text-xs text-white/75 line-clamp-2">
                  {g.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* When query has results */}
      {trimmed && searchResults.hasResults && (
        <div className="space-y-8">
          {/* Top Result / Artists Row */}
          {searchResults.artists.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-[#8F9BAE] uppercase tracking-wider flex items-center gap-1.5">
                <Users size={16} /> Artists ({searchResults.artists.length})
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {searchResults.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    to={`/artist/${artist.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#121620] hover:bg-[#192230] border border-[#1E2635] transition-all group"
                  >
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white group-hover:text-[#D4FF00] truncate">
                        {artist.name}
                      </p>
                      <p className="text-xs text-[#8F9BAE] truncate">
                        Artist • {artist.genres[0]}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Matched Tracks */}
          {searchResults.tracks.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-[#8F9BAE] uppercase tracking-wider flex items-center gap-1.5">
                <Music size={16} /> Songs ({searchResults.tracks.length})
              </h2>

              <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
                <TrackTable
                  tracks={searchResults.tracks}
                  playlistContext={searchResults.tracks.map((t) => t.id)}
                />
              </div>
            </section>
          )}

          {/* Matched Albums */}
          {searchResults.albums.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-[#8F9BAE] uppercase tracking-wider flex items-center gap-1.5">
                <Disc size={16} /> Albums ({searchResults.albums.length})
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {searchResults.albums.map((album) => (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                    className="group flex flex-col p-3 rounded-2xl bg-[#121620] hover:bg-[#18212E] border border-[#1E2635] transition-all"
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
          )}
        </div>
      )}

      {/* No results state */}
      {trimmed && !searchResults.hasResults && (
        <div className="py-16 text-center space-y-3 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#141820] border border-[#232D3F] flex items-center justify-center mx-auto text-[#6B7280]">
            <SearchIcon size={28} />
          </div>
          <h3 className="text-lg font-bold text-white">No results found for "{query}"</h3>
          <p className="text-xs text-[#8F9BAE]">
            Please check your spelling, or try searching for an artist like "Anuv Jain", "Arijit Singh", or genres like "Romantic", "Indie Hindi", or "Lo-Fi".
          </p>
        </div>
      )}
    </div>
  );
};
