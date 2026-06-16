'use client';

import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const baseClass = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
    
    const variantClass = variant === 'primary' 
      ? "bg-amber-600 text-white hover:bg-amber-700" 
      : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-amber-600";
    
    const sizeClass = size === 'sm' ? "px-3 py-1.5 text-xs" : size === 'lg' ? "px-5 py-2.5 text-base" : "px-4 py-2 text-sm";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        // Junta tudo usando string template simples do JavaScript
        className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-white" />
            <span>Carregando...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';