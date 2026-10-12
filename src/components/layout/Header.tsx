import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';
import { usePlayerStore } from '../../store/playerStore';
import { Tooltip } from '../ui/Tooltip';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const setShortcutsOpen = useUiStore((s) => s.setShortcutsOpen);
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0B0D11]/80 backdrop-blur-md border-b border-[#161D27]/80 px-4 md:px-8 flex items-center justify-between">
      {/* History navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-8 h-8 rounded-full bg-[#121620] border border-[#1F2736] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#303B50] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className="w-8 h-8 rounded-full bg-[#121620] border border-[#1F2736] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#303B50] transition-colors cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Center frequency pulse */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#121620] border border-[#1F2736] text-xs font-mono text-[#9CA3AF]">
        <span
          className={`w-2 h-2 rounded-full ${
            isPlaying ? 'bg-[#D4FF00] animate-pulse shadow-[0_0_8px_#D4FF00]' : 'bg-[#4B5563]'
          }`}
        />
        <span>{isPlaying ? 'Frequency Active' : 'Frequency Standby'}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Tooltip content="Keyboard Shortcuts" shortcut="?">
          <button
            onClick={() => setShortcutsOpen(true)}
            aria-label="Keyboard Shortcuts"
            className="p-2 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#141A24] transition-colors cursor-pointer"
          >
            <HelpCircle size={18} />
          </button>
        </Tooltip>

        {/* User profile / session pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131720] border border-[#212A3A]">
          <div className="w-5 h-5 rounded-full bg-[#D4FF00] text-black font-bold text-[10px] flex items-center justify-center">
            S
          </div>
          <span className="text-xs font-medium text-[#E2E8F0] hidden sm:inline">
            Local Session
          </span>
        </div>
      </div>
    </header>
  );
};
