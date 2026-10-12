import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Compass,
  Search,
  Library,
  Heart,
  Plus,
} from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { useUiStore } from '../../store/uiStore';
import { Tooltip } from '../ui/Tooltip';

export const Sidebar: React.FC = () => {
  const playlists = useLibraryStore((s) => s.playlists);
  const likedTrackIds = useLibraryStore((s) => s.likedTrackIds);
  const setCreateOpen = useUiStore((s) => s.setCreatePlaylistOpen);

  const mainNav = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Your Library', path: '/library', icon: Library },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-60 lg:w-64 h-[calc(100vh-5.5rem)] bg-[#0B0D11] border-r border-[#19202C] flex-shrink-0 select-none overflow-hidden"
    >
      {/* Brand Wordmark & Frequency Icon */}
      <div className="p-5 pb-3">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#141820] border border-[#232B3A] flex items-center justify-center group-hover:border-[#D4FF00] transition-colors">
            {/* Custom geometric frequency bars */}
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-0.5 bg-[#D4FF00] h-2 rounded-full" />
              <span className="w-0.5 bg-[#D4FF00] h-4 rounded-full" />
              <span className="w-0.5 bg-[#D4FF00] h-3 rounded-full" />
              <span className="w-0.5 bg-[#D4FF00] h-1.5 rounded-full" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-wider text-[#F3F5F7] group-hover:text-white transition-colors">
              SONORA
            </span>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[#6B7280] -mt-1">
              Find your frequency
            </p>
          </div>
        </NavLink>
      </div>

      {/* Main Navigation Links */}
      <nav className="px-3 py-2 space-y-1">
        {mainNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#18202D] text-[#D4FF00] font-semibold'
                  : 'text-[#9CA3AF] hover:text-[#F3F5F7] hover:bg-[#12161E]'
              }`
            }
          >
            <item.icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Library Links */}
      <div className="px-3 pt-3">
        <NavLink
          to="/liked"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-[#18202D] text-[#D4FF00] font-semibold'
                : 'text-[#9CA3AF] hover:text-[#F3F5F7] hover:bg-[#12161E]'
            }`
          }
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#D4FF00] to-[#84CC16] text-black flex items-center justify-center flex-shrink-0">
            <Heart size={12} fill="currentColor" />
          </div>
          <span className="flex-1">Liked Songs</span>
          <span className="text-xs font-mono text-[#6B7280]">
            {likedTrackIds.length}
          </span>
        </NavLink>
      </div>

      <div className="mx-4 my-3 h-[1px] bg-[#1A222E]" />

      {/* Playlists Header with Create Action */}
      <div className="px-5 py-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
          Playlists
        </span>
        <Tooltip content="Create new playlist">
          <button
            onClick={() => setCreateOpen(true)}
            aria-label="Create playlist"
            className="p-1 rounded-md text-[#9CA3AF] hover:text-[#D4FF00] hover:bg-[#18202D] transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </Tooltip>
      </div>

      {/* Scrollable Playlists List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        {playlists.map((playlist) => (
          <NavLink
            key={playlist.id}
            to={`/playlist/${playlist.id}`}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all truncate group ${
                isActive
                  ? 'bg-[#18202D] text-[#D4FF00] font-semibold'
                  : 'text-[#8F9BAE] hover:text-[#F3F5F7] hover:bg-[#12161E]'
              }`
            }
          >
            <span className="truncate">{playlist.title}</span>
            {playlist.isUserCreated && (
              <span className="text-[10px] text-[#6B7280] group-hover:text-[#9CA3AF] font-mono">
                {playlist.trackIds.length}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
