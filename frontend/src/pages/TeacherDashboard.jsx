import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { teacherService } from '../api/teacher';

const StatusBadge = ({ status }) => {
    if (status === 'tampered' || status === 'error') {
        return <span className="px-2 py-1 rounded bg-cyber-red/10 text-cyber-red border border-cyber-red/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><XCircle size={10} /> TAMPERED</span>
    }
    return <span className="px-2 py-1 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><CheckCircle size={10} /> Secure</span>
}

export default function TeacherDashboard() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const data = await teacherService.getTopics();
                setTopics(data.topics || []);
            } catch (e) {
                console.error("Failed to load topics", e);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                    Teacher <span className="text-cyber-purple">Console</span>
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                    <Clock size={14} />
                    <span>LAST SYNC: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            <Card title="Student Submissions" className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 text-xs font-display tracking-wider text-gray-400 font-normal">STUDENT ID</th>
                                <th className="p-4 text-xs font-display tracking-wider text-gray-400 font-normal">TOPIC</th>
                                <th className="p-4 text-xs font-display tracking-wider text-gray-400 font-normal">DESCRIPTION</th>
                                <th className="p-4 text-xs font-display tracking-wider text-gray-400 font-normal">RECEIPT</th>
                                <th className="p-4 text-xs font-display tracking-wider text-gray-400 font-normal">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 animate-pulse">Scanning database...</td>
                                </tr>
                            ) : topics.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No submissions found in system.</td>
                                </tr>
                            ) : (
                                topics.map((t, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 font-mono text-sm text-cyber-blue">{t.student_id}</td>
                                        <td className="p-4 font-bold text-white break-words max-w-xs">{t.topic_name}</td>
                                        <td className="p-4 text-sm text-gray-400 whitespace-pre-wrap break-words max-w-sm">{t.description}</td>
                                        <td className="p-4 font-mono text-xs text-cyber-purple opacity-70 group-hover:opacity-100">{t.receipt_id}</td>
                                        <td className="p-4">
                                            <StatusBadge status={t.status} />
                                            {/* Assuming all items here are verified or we check logic */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded border border-white/10 bg-black/40">
                    <h4 className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Total Submissions</h4>
                    <p className="text-3xl font-display font-bold text-white">{topics.length}</p>
                </div>
                <div className="p-4 rounded border border-white/10 bg-black/40">
                    <h4 className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Verified Receipts</h4>
                    <p className="text-3xl font-display font-bold text-cyber-green">{topics.length}</p>
                </div>
                <div className="p-4 rounded border border-white/10 bg-black/40 flex flex-col justify-center items-start gap-3">
                    <h4 className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Actions</h4>
                    <button
                        onClick={async () => {
                            try {
                                const blob = await teacherService.downloadExport();
                                const url = window.URL.createObjectURL(new Blob([blob]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'topics_export.csv');
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                            } catch (e) {
                                console.error("Download failed", e);
                                alert("Failed to download export");
                            }
                        }}
                        className="px-4 py-2 bg-cyber-green/10 border border-cyber-green text-cyber-green rounded hover:bg-cyber-green/20 transition-all font-display text-sm font-bold flex items-center gap-2"
                    >
                        <FileText size={16} /> Download Excel (CSV)
                    </button>
                </div>
            </div>
        </div>
    );
}
