import React, { useState, useRef, useEffect } from 'react';
import { useSleepTimerStore } from '../../store/sleepTimerStore';
import { Moon, Check, X } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const SleepTimerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = useSleepTimerStore((s) => s.isActive);
  const isEndOfTrack = useSleepTimerStore((s) => s.isEndOfTrack);
  const remainingSeconds = useSleepTimerStore((s) => s.remainingSeconds);
  const startTimer = useSleepTimerStore((s) => s.startTimer);
  const startEndOfTrackTimer = useSleepTimerStore((s) => s.startEndOfTrackTimer);
  const cancelTimer = useSleepTimerStore((s) => s.cancelTimer);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectMinutes = (mins: number) => {
    startTimer(mins);
    setIsOpen(false);
  };

  const handleSelectEndOfTrack = () => {
    startEndOfTrackTimer();
    setIsOpen(false);
  };

  const handleCancel = () => {
    cancelTimer();
    setIsOpen(false);
  };

  const formatRemaining = () => {
    if (isEndOfTrack) return 'Track';
    if (remainingSeconds === null) return '';
    const mins = Math.ceil(remainingSeconds / 60);
    return `${mins}m`;
  };

  const tooltipText = isActive
    ? isEndOfTrack
      ? 'Sleep Timer: End of track'
      : `Sleep Timer: ${formatRemaining()} left`
    : 'Sleep Timer';

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <Tooltip content={tooltipText}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={tooltipText}
          className={`relative p-2 rounded-full transition-colors cursor-pointer ${
            isActive
              ? 'text-[#D4FF00] bg-[#1E2738] shadow-[0_0_12px_rgba(212,255,0,0.2)]'
              : 'text-[#9CA3AF] hover:text-white hover:bg-[#18202D]'
          }`}
        >
          <Moon size={18} />
          {isActive && (
            <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-[#D4FF00] text-black text-[9px] font-mono font-bold leading-tight">
              {formatRemaining()}
            </span>
          )}
        </button>
      </Tooltip>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-52 p-2 rounded-2xl bg-[#121620] border border-[#232F42] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-[#1F293A] mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Moon size={13} className="text-[#D4FF00]" /> Sleep Timer
            </span>
            {isActive && (
              <button
                onClick={handleCancel}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 cursor-pointer"
              >
                <X size={11} /> Turn off
              </button>
            )}
          </div>

          <div className="space-y-0.5">
            {[15, 30, 45, 60].map((mins) => {
              const isSelected =
                isActive && !isEndOfTrack && remainingSeconds !== null &&
                remainingSeconds <= mins * 60 && remainingSeconds > (mins - 15) * 60;

              return (
                <button
                  key={mins}
                  onClick={() => handleSelectMinutes(mins)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#1D2534] text-[#D4FF00]'
                      : 'text-[#C5D0E0] hover:text-white hover:bg-[#18202E]'
                  }`}
                >
                  <span>{mins} minutes</span>
                  {isSelected && <Check size={14} className="text-[#D4FF00]" />}
                </button>
              );
            })}

            <button
              onClick={handleSelectEndOfTrack}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                isActive && isEndOfTrack
                  ? 'bg-[#1D2534] text-[#D4FF00]'
                  : 'text-[#C5D0E0] hover:text-white hover:bg-[#18202E]'
              }`}
            >
              <span>End of track</span>
              {isActive && isEndOfTrack && <Check size={14} className="text-[#D4FF00]" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
