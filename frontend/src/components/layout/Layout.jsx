import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-cyber-black text-gray-200 font-sans selection:bg-cyber-blue selection:text-black">
            {user && <Sidebar />}

            <main className={user ? 'pl-64 transition-all duration-300' : ''}>
                {/* Top Header / Decoration */}
                <div className="h-1 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-blue opacity-50 fixed top-0 left-0 w-full z-[60]" />

                <div className="p-8 max-w-7xl mx-auto min-h-screen">
                    {children}
                </div>
            </main>

            {/* Background Grid Fx */}
            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20 bg-cyber-grid bg-cyber-grid" />
        </div>
    );
};
