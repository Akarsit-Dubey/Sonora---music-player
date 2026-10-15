import React, { useEffect, useRef, useState } from 'react';
import { useLyricsStore } from '../../store/lyricsStore';
import { usePlayerStore } from '../../store/playerStore';
import { useProgressStore } from '../../store/progressStore';
import { TRACKS } from '../../data/tracks';
import { getActiveLyricIndex } from '../../utils/lrcParser';
import { formatTime } from '../../utils/formatTime';
import { safeStorage } from '../../utils/storage';
import { ArtworkImage } from '../ui/ArtworkImage';
import { Button } from '../ui/Button';
import {
  X,
  Maximize2,
  Minimize2,
  Upload,
  ExternalLink,
  Sparkles,
  FileText,
  Volume2,
  Trash2,
} from 'lucide-react';

export const LyricsModal: React.FC = () => {
  const isOpen = useLyricsStore((s) => s.isLyricsOpen);
  const isFullscreen = useLyricsStore((s) => s.isLyricsFullscreen);
  const setOpen = useLyricsStore((s) => s.setLyricsOpen);
  const toggleFullscreen = useLyricsStore((s) => s.toggleFullscreen);
  const getLyricsForTrack = useLyricsStore((s) => s.getLyricsForTrack);
  const importLrcForTrack = useLyricsStore((s) => s.importLrcForTrack);
  const clearCustomLyrics = useLyricsStore((s) => s.clearCustomLyrics);

  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const currentTime = useProgressStore((s) => s.currentTime);
  const requestSeek = useProgressStore((s) => s.requestSeek);

  const currentTrack = TRACKS.find((t) => t.id === currentTrackId);
  const lyricsData = getLyricsForTrack(currentTrackId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  type LyricsFontSize = 'normal' | 'large' | 'huge';
  const [fontSize, setFontSize] = useState<LyricsFontSize>(() => {
    return (safeStorage.getItem('sonora_lyrics_font_size') as LyricsFontSize) || 'large';
  });

  const cycleFontSize = () => {
    const next: LyricsFontSize =
      fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'huge' : 'normal';
    setFontSize(next);
    safeStorage.setItem('sonora_lyrics_font_size', next);
  };

  const fontSizeClasses =
    fontSize === 'normal'
      ? 'text-lg sm:text-xl md:text-2xl'
      : fontSize === 'large'
      ? 'text-xl sm:text-2xl md:text-3xl'
      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl';

  // Active line index based on high-precision playback position
  const activeIndex = lyricsData?.lines
    ? getActiveLyricIndex(lyricsData.lines, currentTime)
    : -1;

  // Auto-scroll to keep active line centered
  useEffect(() => {
    if (isOpen && isAutoScrollEnabled && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex, isOpen, isAutoScrollEnabled]);

  // Handle LRC file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTrackId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importLrcForTrack(currentTrackId, content);
      if (success) {
        setImportStatus('LRC successfully imported & synchronized!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid LRC format. Check timestamp tags.');
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLineClick = (time: number) => {
    requestSeek(time);
    setIsAutoScrollEnabled(true);
  };

  if (!isOpen) return null;

  const externalSearchUrl = currentTrack
    ? `https://www.google.com/search?q=${encodeURIComponent(
        `${currentTrack.title} ${currentTrack.artistName} lyrics`
      )}`
    : 'https://genius.com';

  return (
    <div
      role="dialog"
      aria-label="Synchronized Lyrics"
      className={`fixed z-50 transition-all duration-300 flex flex-col overflow-hidden bg-[#0A0C10] ${
        isFullscreen
          ? 'inset-0'
          : 'inset-x-0 bottom-20 md:bottom-22 top-0 md:top-16 md:rounded-t-3xl border-t border-[#1C2433] shadow-2xl'
      }`}
    >
      {/* Ambient Artwork Backdrop with Deep Scrim */}
      {currentTrack && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <img
            src={currentTrack.artworkUrl}
            alt=""
            className="w-full h-full object-cover blur-3xl scale-125 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D11]/90 via-[#0B0D11]/95 to-[#0B0D11]" />
        </div>
      )}

      {/* Header bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[#1E2738]/80 bg-[#0B0D11]/60 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          {currentTrack && (
            <ArtworkImage
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              id={currentTrack.id}
              title={currentTrack.title}
              size="sm"
              className="rounded-lg shadow"
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white truncate">
                {currentTrack?.title || 'Unknown Track'}
              </h2>
              {lyricsData?.synced && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
                  SYNCED
                </span>
              )}
              {lyricsData?.isUserSupplied && (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 text-[10px] font-mono">
                  CUSTOM LRC
                </span>
              )}
            </div>
            <p className="text-xs text-[#9CA3AF] truncate">
              {currentTrack?.artistName} • {currentTrack?.albumTitle}
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {/* Custom LRC Import trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".lrc,.txt"
            className="hidden"
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-[#9CA3AF] hover:text-white"
            icon={<Upload size={14} />}
          >
            Import LRC
          </Button>

          {lyricsData?.isUserSupplied && currentTrackId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearCustomLyrics(currentTrackId)}
              className="text-xs text-red-400 hover:text-red-300"
              icon={<Trash2 size={14} />}
            >
              Reset
            </Button>
          )}

          {/* Font Size cycle button */}
          <button
            onClick={cycleFontSize}
            title={`Font size: ${fontSize.toUpperCase()} (Click to toggle)`}
            aria-label={`Cycle lyrics font size, currently ${fontSize}`}
            className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-[#9CA3AF] hover:text-[#D4FF00] hover:bg-[#1C2534] transition-colors cursor-pointer border border-[#232F42]"
          >
            <span className="text-[10px]">Aa</span> {fontSize === 'normal' ? '1x' : fontSize === 'large' ? '1.5x' : '2x'}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-2 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1C2534] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            aria-label="Close Lyrics"
            className="p-2 rounded-full text-[#9CA3AF] hover:text-white hover:bg-[#1C2534] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Import Notification Banner if any */}
      {importStatus && (
        <div className="relative z-10 px-6 py-2 bg-[#D4FF00]/15 border-b border-[#D4FF00]/30 text-xs font-mono text-[#D4FF00] flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="cursor-pointer">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Lyrics Display Scroll Area */}
      <div
        ref={scrollContainerRef}
        onWheel={() => setIsAutoScrollEnabled(false)}
        onTouchMove={() => setIsAutoScrollEnabled(false)}
        className="relative z-10 flex-1 overflow-y-auto px-6 md:px-16 py-12 scroll-smooth"
      >
        {lyricsData && lyricsData.lines.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 pb-32">
            {lyricsData.lines.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <div
                  key={`${line.time}-${idx}`}
                  ref={isActive ? activeLineRef : undefined}
                  onClick={() => handleLineClick(line.time)}
                  className={`group relative text-left py-2 px-3 rounded-2xl cursor-pointer transition-all duration-300 select-none ${
                    isActive
                      ? 'text-[#D4FF00] scale-[1.03] font-bold drop-shadow-[0_0_20px_rgba(212,255,0,0.3)] opacity-100 bg-[#D4FF00]/5 -translate-x-1'
                      : isPast
                      ? 'text-[#F3F5F7] opacity-40 hover:opacity-80 font-medium'
                      : 'text-[#F3F5F7] opacity-35 hover:opacity-75 font-medium'
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    {/* Timestamp hint on hover */}
                    <span className="hidden sm:inline-block font-mono text-xs text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity w-10">
                      {formatTime(line.time)}
                    </span>

                    <p className={`${fontSizeClasses} leading-relaxed tracking-tight`}>
                      {line.text}
                    </p>

                    {isActive && isPlaying && (
                      <span className="flex items-center gap-1 text-[#D4FF00] opacity-80">
                        <Volume2 size={16} className="animate-pulse" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Attribution footer */}
            <div className="pt-12 text-center text-xs text-[#6B7280] border-t border-[#1C2534]/50">
              <p>Lyrics source: {lyricsData.source || 'SONORA Synchronized Transcription'}</p>
              <p className="mt-1">Click any timestamped line to seek audio instantly.</p>
            </div>
          </div>
        ) : (
          /* Friendly Unavailable State */
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto p-6 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#141A24] border border-[#232D3F] flex items-center justify-center text-[#9CA3AF] shadow-xl">
              <FileText size={28} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">No lyrics available</h3>
              <p className="text-xs text-[#8F9BAE] mt-1.5 leading-relaxed">
                Synchronized lyrics have not been attached to "{currentTrack?.title}" yet.
                You can import a standard LRC file or search lyrics externally.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                icon={<Upload size={15} className="fill-black" />}
              >
                Import LRC File
              </Button>

              <a
                href={externalSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-medium rounded-full transition-all text-xs px-3.5 py-2 gap-1.5 bg-[#1A1F29] hover:bg-[#252C3A] text-[#F3F5F7] border border-[#2B3547] hover:border-[#4B5563]"
              >
                <span>Search Online</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Floating Resume Auto-Scroll Button if user manually scrolled */}
      {!isAutoScrollEnabled && lyricsData && lyricsData.lines.length > 0 && (
        <button
          onClick={() => {
            setIsAutoScrollEnabled(true);
            if (activeLineRef.current) {
              activeLineRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-[#18202D] border border-[#2B374C] text-xs font-semibold text-[#D4FF00] shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
        >
          <Sparkles size={14} /> Resume Auto-Scroll
        </button>
      )}
    </div>
  );
};
