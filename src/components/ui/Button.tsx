import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md' | 'icon-lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className = '', icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4FF00] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

    const variantStyles = {
      primary: 'bg-[#D4FF00] hover:bg-[#E2FF33] text-black font-semibold shadow-lg shadow-[#D4FF00]/15 hover:shadow-[#D4FF00]/25',
      secondary: 'bg-[#1A1F29] hover:bg-[#252C3A] text-[#F3F5F7] border border-[#2B3547]',
      ghost: 'bg-transparent hover:bg-[#1E2533] text-[#9CA3AF] hover:text-[#F3F5F7]',
      outline: 'bg-transparent border border-[#2B3547] hover:border-[#4B5563] text-[#F3F5F7] hover:bg-[#181D26]',
      danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30',
      icon: 'bg-transparent hover:bg-[#1F2633] text-[#9CA3AF] hover:text-[#F3F5F7] rounded-full p-2',
    }[variant];

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-6 py-3 gap-2.5 font-semibold',
      'icon-sm': 'p-1.5 w-8 h-8',
      'icon-md': 'p-2 w-10 h-10',
      'icon-lg': 'p-3 w-12 h-12',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
