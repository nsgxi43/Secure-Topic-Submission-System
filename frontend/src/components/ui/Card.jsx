import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ children, className, title, ...props }) => {
    return (
        <div
            className={cn(
                'glass-panel p-6 rounded-lg relative overflow-hidden group',
                className
            )}
            {...props}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
            {title && (
                <h3 className="font-display text-xl text-cyber-blue mb-4 tracking-wide uppercase border-b border-white/10 pb-2">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};
