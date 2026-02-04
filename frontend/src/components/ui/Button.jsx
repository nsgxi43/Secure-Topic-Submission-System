import React from 'react';
import { cn } from '../../utils/cn';

export const Button = ({ children, variant = 'primary', className, isLoading, ...props }) => {
    const variants = {
        primary: 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/50 hover:bg-cyber-blue hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]',
        secondary: 'bg-cyber-purple/10 text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple hover:text-black hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]',
        danger: 'bg-cyber-red/10 text-cyber-red border-cyber-red/50 hover:bg-cyber-red hover:text-black hover:shadow-[0_0_20px_rgba(255,0,60,0.4)]',
        ghost: 'bg-transparent text-gray-400 hover:text-white border-transparent hover:bg-white/5',
    };

    return (
        <button
            className={cn(
                'border px-6 py-2 rounded transition-all uppercase tracking-wider font-display text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
            {children}
        </button>
    );
};
