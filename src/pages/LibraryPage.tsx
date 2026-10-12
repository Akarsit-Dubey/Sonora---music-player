import React, { useState, useMemo } from 'react';
import { TRACKS } from '../data/tracks';
import { ALBUMS } from '../data/albums';
import { useLibraryStore } from '../store/libraryStore';
import { useUiStore } from '../store/uiStore';
import { TrackTable } from '../components/library/TrackTable';
import { PlaylistCard } from '../components/playlists/PlaylistCard';
import { ArtworkImage } from '../components/ui/ArtworkImage';
import { Button } from '../components/ui/Button';
import { Library, Plus, Heart, ArrowDownUp, Disc, Music, ListMusic } from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'all' | 'playlists' | 'songs' | 'albums';
type SortOption = 'title' | 'artist' | 'recent';

export const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const playlists = useLibraryStore((s) => s.playlists);
  const likedTrackIds = useLibraryStore((s) => s.likedTrackIds);
  const setCreateOpen = useUiStore((s) => s.setCreatePlaylistOpen);

  // Liked tracks resolved
  const likedTracks = useMemo(
    () =>
      likedTrackIds
        .map((id) => TRACKS.find((t) => t.id === id))
        .filter((t): t is typeof TRACKS[0] => t !== undefined),
    [likedTrackIds]
  );

  // Sorted tracks
  const sortedTracks = useMemo(() => {
    const list = [...TRACKS];
    if (sortBy === 'title') {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'artist') {
      return list.sort((a, b) => a.artistName.localeCompare(b.artistName));
    }
    return list; // default / recent
  }, [sortBy]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18202D] text-[#D4FF00] text-xs font-mono font-semibold mb-2">
            <Library size={14} /> YOUR FREQUENCIES
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Your Library
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setCreateOpen(true)}
          icon={<Plus size={16} />}
        >
          Create Playlist
        </Button>
      </div>

      {/* Tabs and Sort controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1A222E]">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'All', icon: Library },
            { id: 'playlists', label: 'Playlists', icon: ListMusic },
            { id: 'songs', label: 'Liked & Tracks', icon: Music },
            { id: 'albums', label: 'Albums', icon: Disc },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#D4FF00] text-black shadow-md'
                  : 'bg-[#141820] text-[#9CA3AF] hover:text-white border border-[#212A3A]'
              }`}
            >
              <tab.icon size={13} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs text-[#8F9BAE]">
          <ArrowDownUp size={14} />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort library by"
            className="bg-[#141820] border border-[#212A3A] text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D4FF00] cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Title (A-Z)</option>
            <option value="artist">Artist Name</option>
          </select>
        </div>
      </div>

      {/* Content based on tab */}
      {(activeTab === 'all' || activeTab === 'playlists') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ListMusic size={18} className="text-[#D4FF00]" /> Playlists ({playlists.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Liked Songs Special Tile */}
            <Link
              to="/liked"
              className="group relative flex flex-col p-4 rounded-2xl bg-gradient-to-br from-[#1C2C1C] via-[#141E18] to-[#0E1511] border border-[#27462A] hover:border-[#D4FF00]/50 transition-all cursor-pointer shadow-lg hover:shadow-2xl"
            >
              <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-[#D4FF00] to-[#65A30D] flex items-center justify-center mb-3 shadow-md group-hover:scale-[1.02] transition-transform">
                <Heart size={36} fill="black" className="text-black" />
              </div>
              <h4 className="font-semibold text-sm text-white group-hover:text-[#D4FF00] truncate">
                Liked Songs
              </h4>
              <p className="text-xs text-[#8F9BAE] mt-1">
                {likedTrackIds.length} favorite tracks
              </p>
            </Link>

            {/* All Playlists */}
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        </section>
      )}

      {(activeTab === 'all' || activeTab === 'songs') && (
        <div className="space-y-8">
          {activeTab === 'songs' && likedTracks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Heart size={18} className="text-[#D4FF00] fill-[#D4FF00]" /> Your Liked Songs ({likedTracks.length})
                </h2>
              </div>
              <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
                <TrackTable tracks={likedTracks} playlistContext={likedTrackIds} />
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Music size={18} className="text-[#D4FF00]" /> All Audio Tracks ({sortedTracks.length})
              </h2>
            </div>

            <div className="bg-[#0E1218]/80 border border-[#1C2534] rounded-2xl p-2 md:p-3">
              <TrackTable tracks={sortedTracks} />
            </div>
          </section>
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'albums') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Disc size={18} className="text-[#D4FF00]" /> Discography ({ALBUMS.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {ALBUMS.map((album) => (
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
                  {album.artistName} • {album.releaseYear}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
