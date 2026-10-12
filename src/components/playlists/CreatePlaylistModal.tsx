import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useUiStore } from '../../store/uiStore';
import { useLibraryStore } from '../../store/libraryStore';
import { useNavigate } from 'react-router-dom';

export const CreatePlaylistModal: React.FC = () => {
  const isOpen = useUiStore((s) => s.isCreatePlaylistOpen);
  const setOpen = useUiStore((s) => s.setCreatePlaylistOpen);
  const addToast = useUiStore((s) => s.addToast);
  const createPlaylist = useLibraryStore((s) => s.createPlaylist);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newId = createPlaylist(title, description);
    addToast('Playlist created', `"${title}" has been added to your library.`, 'success');
    setTitle('');
    setDescription('');
    setOpen(false);
    navigate(`/playlist/${newId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      title="Create New Playlist"
      description="Give your new frequency a title and mood description."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playlist-title" className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
            Playlist Name *
          </label>
          <input
            id="playlist-title"
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midnight Beats, Sunset Drive"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1218] border border-[#232B3A] text-sm text-[#F3F5F7] placeholder-[#636C7E] focus:outline-none focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="playlist-desc" className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
            Description (Optional)
          </label>
          <textarea
            id="playlist-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add an optional description for this collection..."
            className="w-full px-3.5 py-2 rounded-xl bg-[#0E1218] border border-[#232B3A] text-sm text-[#F3F5F7] placeholder-[#636C7E] focus:outline-none focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232B3A]">
          <Button variant="ghost" size="sm" type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={!title.trim()}>
            Create Playlist
          </Button>
        </div>
      </form>
    </Modal>
  );
};
