import { Shield, LayoutDashboard, Users, FileText, Lock, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    const links = [
        { name: 'Dashboard', path: `/${user.role}`, icon: LayoutDashboard },
        ...(user.role === 'admin' ? [
            { name: 'Audit Logs', path: '/admin', icon: Shield },
            { name: 'System', path: '/admin', icon: Lock },
        ] : []),
        ...(user.role === 'teacher' ? [
            { name: 'Submissions', path: '/teacher', icon: FileText },
        ] : []),
        ...(user.role === 'student' ? [
            { name: 'Submit', path: '/student', icon: FileText },
        ] : [])
    ];

    // De-duplicate links based on path for the simplified menu
    const uniqueLinks = Array.from(new Set(links.map(l => l.path)))
        .map(path => links.find(l => l.path === path));

    return (
        <div className="w-64 h-screen glass-panel border-r border-white/5 fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/50 text-cyber-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-lg tracking-wider text-white">SECURE<span className="text-cyber-blue">SYS</span></h1>
                        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">v2.0.4 Mainnet</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 py-8 px-4 space-y-2">
                {uniqueLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded text-sm font-display tracking-wide transition-all",
                            location.pathname === link.path
                                ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 shadow-[0_0_10px_rgba(0,243,255,0.1)]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <link.icon size={18} />
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-white/5">
                <div className="bg-black/40 rounded p-4 mb-4 border border-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current User</p>
                    <p className="text-sm font-bold text-white font-display uppercase">{user.username}</p>
                    <p className="text-xs text-cyber-purple">{user.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 text-cyber-red hover:bg-cyber-red/10 border border-transparent hover:border-cyber-red/20 py-2 rounded transition-all text-sm font-bold uppercase tracking-wide"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
};
