import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Volume2, Volume1, VolumeX, Volume } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const VolumeControl: React.FC = () => {
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const toggleMute = usePlayerStore((s) => s.toggleMute);

  const effectiveVolume = isMuted ? 0 : volume;

  const getVolumeIcon = () => {
    if (effectiveVolume === 0) return <VolumeX size={18} className="text-[#9CA3AF]" />;
    if (effectiveVolume < 0.3) return <Volume size={18} className="text-[#F3F5F7]" />;
    if (effectiveVolume < 0.7) return <Volume1 size={18} className="text-[#F3F5F7]" />;
    return <Volume2 size={18} className="text-[#F3F5F7]" />;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <div className="flex items-center gap-2 group">
      <Tooltip content={isMuted ? 'Unmute' : 'Mute'} shortcut="M">
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute volume' : 'Mute volume'}
          className="p-1.5 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1A2230] transition-colors cursor-pointer"
        >
          {getVolumeIcon()}
        </button>
      </Tooltip>

      <div className="relative w-20 md:w-24 h-5 flex items-center">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={effectiveVolume}
          onChange={handleChange}
          aria-label="Volume slider"
          className="w-full h-1 bg-[#252C3B] rounded-full group-hover:h-1.5 transition-all"
          style={{
            background: `linear-gradient(to right, #D4FF00 0%, #D4FF00 ${effectiveVolume * 100}%, #252C3B ${effectiveVolume * 100}%, #252C3B 100%)`,
          }}
        />
      </div>
    </div>
  );
};
