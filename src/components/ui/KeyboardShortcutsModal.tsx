import React from 'react';
import { Modal } from './Modal';
import { useUiStore } from '../../store/uiStore';

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause playback' },
  { key: 'K', desc: 'Play / Pause playback' },
  { key: 'J / ←', desc: 'Seek backward 5 seconds' },
  { key: 'L / →', desc: 'Seek forward 5 seconds' },
  { key: 'Shift + N', desc: 'Next track' },
  { key: 'Shift + P', desc: 'Previous track' },
  { key: '↑ / ↓', desc: 'Volume up / down' },
  { key: 'M', desc: 'Mute / Unmute' },
  { key: 'S', desc: 'Toggle shuffle mode' },
  { key: 'R', desc: 'Cycle repeat (off / all / one)' },
  { key: 'Q', desc: 'Toggle play queue drawer' },
  { key: '?', desc: 'Open keyboard shortcuts dialog' },
  { key: 'Esc', desc: 'Close dialogs, drawer, and overlays' },
];

export const KeyboardShortcutsModal: React.FC = () => {
  const isOpen = useUiStore((s) => s.isShortcutsOpen);
  const setOpen = useUiStore((s) => s.setShortcutsOpen);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      title="Keyboard Shortcuts"
      description="Control playback and navigate SONORA without leaving your keyboard."
      maxWidth="md"
    >
      <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
        {SHORTCUTS.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#0E1218] border border-[#1D2533]"
          >
            <span className="text-sm text-[#E2E8F0]">{item.desc}</span>
            <kbd className="px-2 py-1 rounded bg-[#18202C] text-xs font-mono font-semibold text-[#D4FF00] border border-[#2D394E] shadow-sm">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
};
