'use client';

import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', label, error, id, ...props }, ref) => {
    
    const [showPassword, setShowPassword] = React.useState(false);

    const baseInputClass = "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:outline-hidden focus:ring-2";
    
    const stateClass = error 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" 
      : "border-zinc-300 focus:border-amber-500 focus:ring-amber-500/20";

    const isPasswordType = type === 'password';
    
    const finalType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        
        <div className="relative w-full flex items-center">
          <input
            id={id}
            type={finalType}
            ref={ref}
            className={`${baseInputClass} ${stateClass} ${isPasswordType ? 'pr-20' : ''} ${className}`}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 text-xs font-semibold select-none cursor-pointer transition-colors"
              tabIndex={-1} 
            >
              {showPassword ? '🙈 Ocultar' : '👁️ Ver'}
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 font-medium mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';