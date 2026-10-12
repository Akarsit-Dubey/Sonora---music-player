import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { App } from '../App';

describe('App Integration', () => {
  it('renders SONORA brand wordmark and core navigation items', () => {
    render(<App />);

    expect(screen.getByText('SONORA')).toBeDefined();
    expect(screen.getByText('Find your frequency')).toBeDefined();
    
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Discover').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Search').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the persistent bottom player with media controls', () => {
    render(<App />);

    const player = screen.getByRole('region', { name: /audio player/i });
    expect(player).toBeDefined();

    const playerQueries = within(player);
    expect(playerQueries.getByRole('button', { name: /toggle shuffle/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /previous track/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /^(play|pause)$/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /next track/i })).toBeDefined();
    expect(playerQueries.getByRole('button', { name: /cycle repeat mode/i })).toBeDefined();
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

  it('performs reactive search filtering', () => {
    render(<App />);

    const searchLinks = screen.getAllByRole('link', { name: /search/i });
    fireEvent.click(searchLinks[0]);

    const input = screen.getByPlaceholderText(/search tracks, artists, albums, or genres/i);
    fireEvent.change(input, { target: { value: 'Cyber' } });

    // Should find Cyberlink matches across artist and tracks
    expect(screen.getAllByText(/cyberlink/i).length).toBeGreaterThanOrEqual(1);
  });

  it('opens and closes the keyboard shortcuts modal', () => {
    render(<App />);

    const helpBtn = screen.getByRole('button', { name: /keyboard shortcuts/i });
    fireEvent.click(helpBtn);

    expect(screen.getByRole('dialog', { name: /keyboard shortcuts/i })).toBeDefined();

    // Close button
    const closeBtn = screen.getByRole('button', { name: /close dialog/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /keyboard shortcuts/i })).toBeNull();
  });
});
