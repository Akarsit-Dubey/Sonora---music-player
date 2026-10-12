import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from '../store/libraryStore';
import { safeStorage } from '../utils/storage';

describe('useLibraryStore', () => {
  beforeEach(() => {
    safeStorage.clear();
  });

  it('toggles liking and unliking tracks', () => {
    const store = useLibraryStore.getState();
    const trackId = 'test-track-99';

    expect(store.isLiked(trackId)).toBe(false);

    const isNowLiked = store.toggleLikeTrack(trackId);
    expect(isNowLiked).toBe(true);
    expect(useLibraryStore.getState().isLiked(trackId)).toBe(true);

    const isUnliked = useLibraryStore.getState().toggleLikeTrack(trackId);
    expect(isUnliked).toBe(false);
    expect(useLibraryStore.getState().isLiked(trackId)).toBe(false);
  });

  it('creates and updates a user playlist', () => {
    const store = useLibraryStore.getState();
    const newId = store.createPlaylist('Late Night Vibes', 'Chill music');

    const created = useLibraryStore.getState().getPlaylistById(newId);
    expect(created).toBeDefined();
    expect(created?.title).toBe('Late Night Vibes');
    expect(created?.isUserCreated).toBe(true);

    useLibraryStore.getState().updatePlaylist(newId, {
      title: 'Midnight Beats',
    });
    expect(useLibraryStore.getState().getPlaylistById(newId)?.title).toBe('Midnight Beats');
  });

  it('adds and removes tracks from a playlist without allowing duplicates', () => {
    const store = useLibraryStore.getState();
    const pId = store.createPlaylist('Test Playlist');

    const added1 = store.addTrackToPlaylist(pId, 'track-1');
    expect(added1).toBe(true);

    // Duplicate check
    const addedDuplicate = useLibraryStore.getState().addTrackToPlaylist(pId, 'track-1');
    expect(addedDuplicate).toBe(false);

    expect(useLibraryStore.getState().getPlaylistById(pId)?.trackIds).toEqual(['track-1']);

    useLibraryStore.getState().removeTrackFromPlaylist(pId, 'track-1');
    expect(useLibraryStore.getState().getPlaylistById(pId)?.trackIds).toEqual([]);
  });

  it('prevents deleting editorial playlists while allowing deleting user playlists', () => {
    const store = useLibraryStore.getState();
    // Default playlist-1 is editorial
    store.deletePlaylist('playlist-1');
    expect(useLibraryStore.getState().getPlaylistById('playlist-1')).toBeDefined();

    // User playlist can be deleted
    const userPlId = store.createPlaylist('Temporary Playlist');
    expect(useLibraryStore.getState().getPlaylistById(userPlId)).toBeDefined();

    useLibraryStore.getState().deletePlaylist(userPlId);
    expect(useLibraryStore.getState().getPlaylistById(userPlId)).toBeUndefined();
  });
});
