import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckSquare, Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { adminService } from '../api/admin';

export default function AdminDashboard() {
    const [logs, setLogs] = useState([]);
    const [finalizing, setFinalizing] = useState(false);
    const [finalizeStatus, setFinalizeStatus] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await adminService.getAuditLogs();
            // Backend returns { audit_logs: [...] }
            setLogs(data.audit_logs || []);
        } catch (e) {
            console.error(e);
        }
    }

    const handleFinalize = async () => {
        setFinalizing(true);
        setFinalizeStatus(null);
        try {
            const res = await adminService.finalizeSystem();
            setFinalizeStatus({ type: 'success', msg: res.message || 'System finalized successfully.' });
            fetchLogs(); // refresh logs
        } catch (e) {
            setFinalizeStatus({ type: 'error', msg: 'System finalization failed.' });
        } finally {
            setFinalizing(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                    System <span className="text-cyber-red">Administration</span>
                </h2>
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-cyber-green animate-pulse" />
                    <span className="text-xs font-mono text-cyber-green">SYSTEM ONLINE</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Controls */}
                <Card title="Governance Controls" className="lg:col-span-1 border-cyber-red/30">
                    <div className="space-y-6">
                        <div className="p-4 bg-cyber-red/5 rounded border border-cyber-red/20">
                            <div className="flex items-center gap-3 mb-2 text-cyber-red">
                                <AlertTriangle size={20} />
                                <h4 className="font-bold uppercase text-sm">Critical Action</h4>
                            </div>
                            <p className="text-xs text-gray-400 mb-4">
                                Finalizing the system will lock current submissions and generate the final hash chain for integrity verification. This action cannot be undone.
                            </p>
                            <Button
                                variant="danger"
                                className="w-full"
                                onClick={handleFinalize}
                                isLoading={finalizing}
                            >
                                INITIALIZE LOCKDOWN
                            </Button>
                            {finalizeStatus && (
                                <p className={`text-xs mt-3 text-center ${finalizeStatus.type === 'success' ? 'text-cyber-green' : 'text-cyber-red'}`}>
                                    {finalizeStatus.msg}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-xs font-display uppercase text-gray-500">System Metrics</h4>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded">
                                <span className="text-sm text-gray-300">Total Audit Events</span>
                                <span className="font-mono text-cyber-blue">{logs.length}</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded">
                                <span className="text-sm text-gray-300">Security Level</span>
                                <span className="font-mono text-cyber-green">HIGH</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Audit Logs */}
                <Card title="System Audit Logs" className="lg:col-span-2 h-[500px] flex flex-col">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                        {logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <Activity size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">No audit logs recorded yet.</p>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-mono">
                                    <div className="min-w-[140px] text-xs text-gray-500 mt-1">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-cyber-blue font-bold mr-2">[{log.action || 'SYSTEM'}]</span>
                                    </div>
                                    <div className="text-xs text-cyber-purple">
                                        User ID: {log.user_id || 'SYSTEM'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
