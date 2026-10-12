import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useUiStore } from '../../store/uiStore';
import { useLibraryStore } from '../../store/libraryStore';
import type { Playlist } from '../../types/music';

interface EditPlaylistFormProps {
  playlist: Playlist;
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
}

const EditPlaylistForm: React.FC<EditPlaylistFormProps> = ({ playlist, onSave, onCancel }) => {
  const [title, setTitle] = useState(playlist.title);
  const [description, setDescription] = useState(playlist.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), description.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="edit-title" className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
          Playlist Name *
        </label>
        <input
          id="edit-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1218] border border-[#232B3A] text-sm text-[#F3F5F7] placeholder-[#636C7E] focus:outline-none focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] transition-colors"
        />
      </div>

      <div>
        <label htmlFor="edit-desc" className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1.5">
          Description
        </label>
        <textarea
          id="edit-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl bg-[#0E1218] border border-[#232B3A] text-sm text-[#F3F5F7] placeholder-[#636C7E] focus:outline-none focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] transition-colors resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232B3A]">
        <Button variant="ghost" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" type="submit" disabled={!title.trim()}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export const EditPlaylistModal: React.FC = () => {
  const editingId = useUiStore((s) => s.editingPlaylistId);
  const setEditingId = useUiStore((s) => s.setEditingPlaylistId);
  const addToast = useUiStore((s) => s.addToast);
  const getPlaylistById = useLibraryStore((s) => s.getPlaylistById);
  const updatePlaylist = useLibraryStore((s) => s.updatePlaylist);

  const playlist = editingId ? getPlaylistById(editingId) : null;

  const handleSave = (title: string, description: string) => {
    if (!editingId) return;
    updatePlaylist(editingId, { title, description });
    addToast('Playlist updated', `"${title}" has been updated.`, 'success');
    setEditingId(null);
  };

  return (
    <Modal
      isOpen={!!editingId && !!playlist}
      onClose={() => setEditingId(null)}
      title="Edit Playlist Details"
      description="Update the name and description of your playlist."
    >
      {playlist && (
        <EditPlaylistForm
          key={playlist.id}
          playlist={playlist}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      )}
    </Modal>
  );
};
