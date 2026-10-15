import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { useProgressStore } from '../../store/progressStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useSleepTimerStore } from '../../store/sleepTimerStore';
import { TRACKS } from '../../data/tracks';

export const AudioEngine: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrackId = usePlayerStore((s) => s.currentTrackId);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const volume = usePlayerStore((s) => s.volume);
  const isMuted = usePlayerStore((s) => s.isMuted);
  const nextTrack = usePlayerStore((s) => s.nextTrack);
  const prevTrack = usePlayerStore((s) => s.prevTrack);
  const handleTrackEnded = usePlayerStore((s) => s.handleTrackEnded);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const setBuffering = usePlayerStore((s) => s.setBuffering);
  const setPlaybackError = usePlayerStore((s) => s.setPlaybackError);
  const pause = usePlayerStore((s) => s.pause);

  const seekTarget = useProgressStore((s) => s.seekTarget);
  const setCurrentTime = useProgressStore((s) => s.setCurrentTime);
  const setDuration = useProgressStore((s) => s.setDuration);
  const clearSeekRequest = useProgressStore((s) => s.clearSeekRequest);

  const addRecentlyPlayed = useLibraryStore((s) => s.addRecentlyPlayed);

  const currentTrack = TRACKS.find((t) => t.id === currentTrackId);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onDurationChange = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onWaiting = () => {
      setBuffering(true);
    };

    const onCanPlay = () => {
      setBuffering(false);
    };

    const onPlaying = () => {
      setBuffering(false);
      setPlaybackError(null);
    };

    const onEnded = () => {
      // Check if sleep timer was set for end of current track
      const { isActive, isEndOfTrack } = useSleepTimerStore.getState();
      if (isActive && isEndOfTrack) {
        useSleepTimerStore.getState().handleTrackEndedCheck();
        return;
      }

      const mode = usePlayerStore.getState().repeatMode;
      if (mode === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          setCurrentTime(0);
          audioRef.current.play().catch((err) => console.warn('Repeat play failed:', err));
        }
      } else {
        handleTrackEnded();
      }
    };

    const onError = () => {
      setBuffering(false);
      const error = audio.error;
      let errorMsg = 'Failed to load audio stream.';
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Playback was aborted.';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error during audio download.';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Audio decoding error.';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Audio source format not supported.';
            break;
        }
      }
      console.warn('Audio playback error:', errorMsg, audio.src);
      setPlaybackError(errorMsg);
      pause();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [setCurrentTime, setDuration, setBuffering, setPlaybackError, handleTrackEnded, pause]);

  // Handle Track Source Changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrack) {
      // Check if source actually changed
      const currentSrc = audio.getAttribute('src');
      if (currentSrc !== currentTrack.audioUrl) {
        audio.src = currentTrack.audioUrl;
        audio.load();
        setCurrentTime(0);
        setDuration(currentTrack.duration);

        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              if (err.name === 'NotAllowedError') {
                console.info('Autoplay prevented by browser. Awaiting user interaction.');
                pause();
              } else {
                console.warn('Audio play request failed:', err);
              }
            });
          }
        }

        addRecentlyPlayed(currentTrack.id);
      }
    }
  }, [currentTrack, addRecentlyPlayed, pause, setCurrentTime, setDuration, isPlaying]);

  // Handle Play / Pause State Changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name === 'NotAllowedError') {
            console.info('Playback paused due to autoplay policy.');
            pause();
          } else {
            console.warn('Playback error:', err);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, pause]);

  // Handle Volume & Mute Changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Sync HTML5 audio.loop with repeatMode === 'one'
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = repeatMode === 'one';
  }, [repeatMode]);

  // Handle Seek Requests
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seekTarget === null) return;

    try {
      audio.currentTime = seekTarget;
      setCurrentTime(seekTarget);
    } catch (e) {
      console.warn('Seeking error:', e);
    } finally {
      clearSeekRequest();
    }
  }, [seekTarget, clearSeekRequest, setCurrentTime]);

  // Handle Media Session API for OS Lockscreen and Hardware Media Keys
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artistName,
        album: currentTrack.albumTitle,
        artwork: [
          { src: currentTrack.artworkUrl, sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => usePlayerStore.getState().resume());
      navigator.mediaSession.setActionHandler('pause', () => usePlayerStore.getState().pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          useProgressStore.getState().requestSeek(details.seekTime);
        }
      });
    } catch (e) {
      console.warn('MediaSession setup failed:', e);
    }
  }, [currentTrack, nextTrack, prevTrack]);

  return null; // Headless component
};
