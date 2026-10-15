import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { safeStorage } from '../utils/storage';
import { useLyricsStore } from '../store/lyricsStore';

describe('App Integration', () => {
  beforeEach(() => {
    safeStorage.clear();
    useLyricsStore.setState({ isLyricsOpen: false, isLyricsFullscreen: false, customLyrics: {} });
  });

  it('renders SONORA brand wordmark and core navigation items', () => {
    render(<App />);

    expect(screen.getByText('SONORA')).toBeDefined();
    expect(screen.getByText('Find your frequency')).toBeDefined();
    
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Discover').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Search').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the persistent bottom player with media controls including lyrics button', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /audio player/i });
    expect(player).toBeDefined();

    const playerQueries = within(player);
    expect(playerQueries.getByRole('button', { name: /toggle shuffle/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /previous track/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /^(play|pause)$/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /next track/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /cycle repeat mode/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /toggle synchronized lyrics/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /sleep timer/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /toggle playback queue/i })).toBeDefined();
  });

  it('supports navigation to Discover, Search, and Library', () => {
    render(<App />);

    // Click Discover in sidebar
    const discoverLinks = screen.getAllByRole('link', { name: /discover/i });
    fireEvent.click(discoverLinks[0]);
    expect(screen.getByText(/discover soundscapes/i)).toBeDefined();

    // Click Search in sidebar
    const searchLinks = screen.getAllByRole('link', { name: /search/i });
    fireEvent.click(searchLinks[0]);
    expect(screen.getByPlaceholderText(/search tracks, artists, albums, or genres/i)).toBeDefined();

    // Click Library in sidebar
    const libraryLinks = screen.getAllByRole('link', { name: /your library/i });
    fireEvent.click(libraryLinks[0]);
    expect(screen.getByText(/your frequencies/i)).toBeDefined();
  });

  it('performs reactive search filtering for Hindi artists and songs', () => {
    render(<App />);

    const searchLinks = screen.getAllByRole('link', { name: /search/i });
    fireEvent.click(searchLinks[0]);

    const input = screen.getByPlaceholderText(/search tracks, artists, albums, or genres/i);
    fireEvent.change(input, { target: { value: 'Anuv' } });

    // Should find Anuv Jain in artist and tracks
    expect(screen.getAllByText(/anuv jain/i).length).toBeGreaterThanOrEqual(1);
  });

  it('opens and closes the synchronized lyrics modal via bottom player button', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /audio player/i });
    const lyricsBtn = within(player).getByRole('button', { name: /toggle synchronized lyrics/i });

    // Open lyrics
    fireEvent.click(lyricsBtn);

    const dialog = screen.getByRole('dialog', { name: /synchronized lyrics/i });
    expect(dialog).toBeDefined();

    // Verify lyrics content is present
    expect(screen.getByText(/synced/i)).toBeDefined();
    expect(screen.getByText(/import lrc/i)).toBeDefined();

    // Close lyrics dialog via close button
    const closeBtn = within(dialog).getByRole('button', { name: /close lyrics/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /synchronized lyrics/i })).toBeNull();
  });

  it('toggles lyrics with Ctrl+L shortcut and closes with Escape key', () => {
    render(<App />);

    // Press Ctrl+L to toggle lyrics
    fireEvent.keyDown(window, { key: 'l', code: 'KeyL', ctrlKey: true });

    expect(screen.getByRole('dialog', { name: /synchronized lyrics/i })).toBeDefined();

    // Press Escape to close lyrics
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('dialog', { name: /synchronized lyrics/i })).toBeNull();
  });

  it('opens and closes the keyboard shortcuts modal and displays Ctrl + L', () => {
    render(<App />);

    const helpBtn = screen.getByRole('button', { name: /keyboard shortcuts/i });
    fireEvent.click(helpBtn);

    expect(screen.getByRole('dialog', { name: /keyboard shortcuts/i })).toBeDefined();
    expect(screen.getByText('Ctrl + L')).toBeDefined();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /keyboard shortcuts/i })).toBeNull();
  });

  it('opens sleep timer options from bottom player', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /audio player/i });
    const sleepTimerBtn = within(player).getByRole('button', { name: /sleep timer/i });

    fireEvent.click(sleepTimerBtn);

    expect(screen.getByText('15 minutes')).toBeDefined();
    expect(screen.getByText('30 minutes')).toBeDefined();
    expect(screen.getByText('End of track')).toBeDefined();
  });

  it('stores and displays recent searches on the search page', () => {
    render(<App />);

    const searchLinks = screen.getAllByRole('link', { name: /search/i });
    fireEvent.click(searchLinks[0]);

    const input = screen.getByPlaceholderText(/search tracks, artists, albums, or genres/i);
    fireEvent.change(input, { target: { value: 'Arijit' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Clear search input
    const clearBtn = screen.getByRole('button', { name: /clear search query/i });
    fireEvent.click(clearBtn);

    // Recent search chip should appear
    expect(screen.getByText('Recent Searches')).toBeDefined();
    expect(screen.getByText('Arijit')).toBeDefined();
  });
});
