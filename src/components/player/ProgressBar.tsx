import React, { useRef, useState } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { formatTime } from '../../utils/formatTime';

export const ProgressBar: React.FC = () => {
  const currentTime = useProgressStore((s) => s.currentTime);
  const duration = useProgressStore((s) => s.duration);
  const requestSeek = useProgressStore((s) => s.requestSeek);

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);

  const barRef = useRef<HTMLDivElement>(null);

  const displayTime = isScrubbing ? scrubTime : currentTime;
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (displayTime / duration) * 100)) : 0;

  const calculateTimeFromEvent = (e: React.MouseEvent<HTMLDivElement>): number => {
    if (!barRef.current || duration <= 0) return 0;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    return ratio * duration;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = calculateTimeFromEvent(e);
    setIsScrubbing(true);
    setScrubTime(target);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!barRef.current || duration <= 0) return;
      const rect = barRef.current.getBoundingClientRect();
      const clickX = moveEvent.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      setScrubTime(ratio * duration);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      if (barRef.current && duration > 0) {
        const rect = barRef.current.getBoundingClientRect();
        const clickX = upEvent.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        requestSeek(ratio * duration);
      }
      setIsScrubbing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const touch = e.touches[0];
    const rect = barRef.current.getBoundingClientRect();
    const clickX = touch.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const target = ratio * duration;

    setIsScrubbing(true);
    setScrubTime(target);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      if (!barRef.current || duration <= 0) return;
      const moveTouch = moveEvent.touches[0];
      const r = barRef.current.getBoundingClientRect();
      const x = moveTouch.clientX - r.left;
      const rat = Math.max(0, Math.min(1, x / r.width));
      setScrubTime(rat * duration);
    };

    const handleTouchEnd = (endEvent: TouchEvent) => {
      if (barRef.current && duration > 0) {
        const endTouch = endEvent.changedTouches[0];
        const r = barRef.current.getBoundingClientRect();
        const x = endTouch.clientX - r.left;
        const rat = Math.max(0, Math.min(1, x / r.width));
        requestSeek(rat * duration);
      }
      setIsScrubbing(false);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverTime(ratio * duration);
    setHoverPosition(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  return (
    <div className="flex items-center gap-2.5 w-full">
      <span className="text-[11px] font-mono font-medium text-[#9CA3AF] w-9 text-right select-none">
        {formatTime(displayTime)}
      </span>

      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex-1 h-5 flex items-center cursor-pointer group py-2"
        role="slider"
        aria-label="Seek track"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={displayTime}
      >
        {/* Track groove */}
        <div className="w-full h-1 group-hover:h-1.5 bg-[#252C3B] rounded-full overflow-hidden transition-all duration-150 relative">
          {/* Progress fill */}
          <div
            className="h-full bg-[#D4FF00] rounded-full transition-all ease-linear duration-75 relative"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hover preview tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute bottom-6 -translate-x-1/2 pointer-events-none rounded bg-[#1B2230] border border-[#2D394E] px-2 py-0.5 text-[10px] font-mono text-white shadow-xl"
            style={{ left: `${hoverPosition}px` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        {/* Scrub thumb indicator */}
        <div
          className="absolute w-3 h-3 rounded-full bg-[#D4FF00] shadow-[0_0_10px_rgba(212,255,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 pointer-events-none"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <span className="text-[11px] font-mono font-medium text-[#6B7280] w-9 select-none">
        {formatTime(duration)}
      </span>
    </div>
  );
};
