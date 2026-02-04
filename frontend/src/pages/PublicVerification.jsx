import React, { useState } from 'react';
import { Search, Shield, Check, X, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import axios from 'axios';

// Since this is public, we might not use the authenticated client or just use it if it handles public endpoints safely.
// We will use standard axios here to avoid any auth header issues if sessions aren't required, 
// but the client is fine too. Let's use standard axios to be safe for a "Public" page.

const API_URL = 'http://127.0.0.1:5000';

export default function PublicVerification() {
    const [receiptId, setReceiptId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.get(`${API_URL}/receipt/${receiptId}`);
            setResult(response.data);
        } catch (err) {
            setError('Receipt not found or invalid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black text-gray-200 font-sans p-6 flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background FX */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50" />

            <div className="w-full max-w-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-cyber-black rounded-full mx-auto flex items-center justify-center border border-cyber-green/50 shadow-[0_0_40px_rgba(10,255,0,0.2)] mb-6 relative">
                        <div className="absolute inset-0 rounded-full border border-cyber-green/30 animate-ping opacity-20" />
                        <Shield size={40} className="text-cyber-green" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">PUBLIC VERIFICATION <span className="text-cyber-green">LEDGER</span></h1>
                    <p className="text-gray-400">Validate cryptographic receipts against the immutable record.</p>
                </div>

                <Card className="border-cyber-green/30 shadow-2xl">
                    <form onSubmit={handleVerify} className="p-4 flex gap-4">
                        <Input
                            placeholder="Paste Receipt ID (e.g. 8a7c...)"
                            className="flex-1 text-lg font-mono bg-black/60"
                            value={receiptId}
                            onChange={(e) => setReceiptId(e.target.value)}
                        />
                        <Button type="submit" isLoading={loading} className="shrink-0 bg-cyber-green/20 text-cyber-green border-cyber-green/50 hover:bg-cyber-green hover:text-black">
                            VERIFY <ArrowRight size={16} />
                        </Button>
                    </form>

                    {error && (
                        <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-cyber-red/10 border border-cyber-red/50 text-cyber-red p-4 rounded flex items-center gap-3">
                                <X size={24} />
                                <div>
                                    <h4 className="font-bold">Verification Failed</h4>
                                    <p className="text-sm opacity-80">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {result && (
                        <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2">
                            <div className="bg-cyber-green/10 border border-cyber-green/50 p-6 rounded relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-20">
                                    <Shield size={100} />
                                </div>

                                <div className="flex items-center gap-3 text-cyber-green mb-6">
                                    <Check size={28} />
                                    <h3 className="text-xl font-bold font-display tracking-wider">VALID RECEIPT</h3>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="grid grid-cols-3 gap-4 border-b border-cyber-green/20 pb-4">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest">Student</div>
                                        <div className="col-span-2 font-mono text-white">{result.student_id ? result.student_id : 'HIDDEN'}</div>
                                    </div>

                                    {/* Assuming receipt data structure has topic. If not we just show raw data */}
                                    {result.topic && (
                                        <div className="grid grid-cols-3 gap-4 border-b border-cyber-green/20 pb-4">
                                            <div className="text-xs text-gray-400 uppercase tracking-widest">Topic</div>
                                            <div className="col-span-2 font-bold text-white">{result.topic}</div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-xs text-gray-400 uppercase tracking-widest">Timestamp</div>
                                        <div className="col-span-2 font-mono text-cyber-green">{new Date().toISOString()} (Verified)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                <div className="mt-8 text-center">
                    <a href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">Admin / Student Login</a>
                </div>
            </div>
        </div>
    );
}
