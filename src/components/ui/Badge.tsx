import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'default' | 'outline' | 'surface';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    lime: 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30',
    default: 'bg-[#1E2533] text-[#9CA3AF] border border-[#2B3547]',
    outline: 'bg-transparent text-[#9CA3AF] border border-[#2B3547]',
    surface: 'bg-[#141820] text-[#E2E8F0] border border-[#242E3E]',
  }[variant];

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide select-none ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};
