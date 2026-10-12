import React from 'react';
import { useUiStore } from '../../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 size={16} className="text-[#D4FF00] flex-shrink-0" />,
          error: <AlertCircle size={16} className="text-red-400 flex-shrink-0" />,
          warning: <AlertCircle size={16} className="text-amber-400 flex-shrink-0" />,
          info: <Info size={16} className="text-sky-400 flex-shrink-0" />,
        }[toast.type || 'info'];

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#141820] border border-[#263143] text-sm text-[#F3F5F7] shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <div>
                <p className="font-semibold text-xs text-white">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{toast.message}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6B7280] hover:text-[#F3F5F7] transition-colors p-1"
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
