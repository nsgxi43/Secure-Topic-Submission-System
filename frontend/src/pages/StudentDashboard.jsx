import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Search, Copy, Download, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { studentService } from '../api/student';

export default function StudentDashboard() {
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        if (error) {
            setShowErrorModal(true);
        }
    }, [error]);

    const closeErrorModal = () => {
        setShowErrorModal(false);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const data = await studentService.submitTopic(topic, description);
            setReceipt(data.receipt); // Assuming backend returns { receipt: "..." }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const copyReceipt = () => {
        navigator.clipboard.writeText(receipt);
    };

    return (
        <div className="space-y-8 relative">
            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-cyber-dark border border-cyber-red rounded-lg p-6 max-w-sm w-full shadow-[0_0_30px_rgba(255,0,0,0.3)] text-center relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={closeErrorModal}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white"
                        >
                            <XCircle size={20} />
                        </button>
                        <div className="w-16 h-16 bg-cyber-red/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyber-red/50">
                            <Lock size={32} className="text-cyber-red" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Submission Rejected</h3>
                        <p className="text-cyber-red/90 mb-6">{error}</p>
                        <Button onClick={closeErrorModal} className="w-full bg-cyber-red hover:bg-red-600 text-white border-none">
                            Dismiss
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">
                    Student <span className="text-cyber-green">Portal</span>
                </h2>
            </div>
            {/* ... rest of the layout ... */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Submission Panel */}
                <Card title="New Submission" className="h-full">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Project Topic"
                            placeholder="Enter your cryptographic topic..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            required
                        />
                        <div className="w-full">
                            <label className="block text-cyber-blue/80 text-xs font-display tracking-widest uppercase mb-2 ml-1">
                                Description
                            </label>
                            <textarea
                                className="w-full bg-cyber-dark/50 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue/30 transition-all placeholder:text-gray-600 h-32 resize-none"
                                placeholder="Brief description of the implementation..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        {/* Inline error removed/hidden since we have modal now, or keep as backup */}

                        <Button type="submit" isLoading={loading} className="w-full">
                            <FileText size={16} />
                            Submit Topic
                        </Button>
                    </form>
                </Card>

                {/* Receipt Panel */}
                <Card title="Submission Receipt" className="h-full flex flex-col">
                    {receipt ? (
                        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 p-4">
                            <div className="w-20 h-20 rounded-full bg-cyber-green/10 flex items-center justify-center border border-cyber-green/50 shadow-[0_0_30px_rgba(10,255,0,0.2)]">
                                <CheckCircle size={40} className="text-cyber-green" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Submission Successful</h3>
                                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                    Your cryptographic receipt is unique and verifiable. Keep it safe to prove your submission.
                                </p>
                            </div>

                            <div className="w-full bg-black/60 p-4 rounded border border-white/10 relative group">
                                <code className="text-cyber-blue font-mono text-xs break-all">
                                    {receipt}
                                </code>
                                <button
                                    onClick={copyReceipt}
                                    className="absolute top-2 right-2 p-2 bg-cyber-dark hover:bg-white/10 rounded text-gray-400 hover:text-white transition-all"
                                    title="Copy to clipboard"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>

                            <Button variant="secondary" onClick={() => window.print()} className="w-full">
                                <Download size={16} />
                                Save Confirmation
                            </Button>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-center text-gray-500 opacity-50">
                            <Lock size={48} className="mb-4" />
                            <p>Secure receipt will be generated upon submission</p>
                        </div>
                    )}
                </Card>
            </div>

            <Card title="Verification Info" className="md:col-span-2 bg-cyber-blue/5 border-cyber-blue/20">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded bg-cyber-blue/10 text-cyber-blue">
                        <Search size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-1">How to verify?</h4>
                        <p className="text-sm text-gray-400">
                            You can verify verify your submission integrity at the public verification portal using your receipt ID.
                            The system uses a hash chain to ensure no data has been tampered with since your submission time.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
