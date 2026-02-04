import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-cyber-blue/80 text-xs font-display tracking-widest uppercase mb-2 ml-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={cn(
                    'w-full bg-cyber-dark/50 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all placeholder:text-gray-600',
                    error && 'border-cyber-red focus:border-cyber-red focus:ring-cyber-red/30',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-cyber-red text-xs mt-1 ml-1 font-mono">{error}</p>
            )}
        </div>
    );
});
