import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  shortcut?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  shortcut,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute ${positionClasses} z-50 pointer-events-none whitespace-nowrap rounded-md bg-[#1B2230] border border-[#2D394E] px-2.5 py-1 text-xs font-medium text-[#F3F5F7] shadow-xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-1.5`}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="px-1.5 py-0.5 rounded bg-[#0E1117] text-[10px] text-[#A3E635] font-mono border border-[#2C374A]">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
};
