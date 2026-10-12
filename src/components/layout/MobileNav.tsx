import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Search, Library } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Library', path: '/library', icon: Library },
  ];

  return (
    <nav className="md:hidden fixed bottom-20 left-0 right-0 z-30 h-14 bg-[#0A0C10]/95 backdrop-blur-lg border-t border-[#1C2330] flex items-center justify-around px-2">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 w-16 py-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#D4FF00]' : 'text-[#8F9BAE]'
            }`
          }
        >
          <item.icon size={18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
