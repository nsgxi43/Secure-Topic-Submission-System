import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Key, User, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authService } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'student',
        otp: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Creds/Email, 2: OTP

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        if (!formData.email || !formData.password) {
            setError("Please enter your email and password");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.sendStudentOtp(formData.email, formData.password);
            setStep(2); // Move to OTP input
            setMessage(`Password confirmed. OTP sent to ${formData.email}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to verify credentials or send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            // STUDENT LOGIN FLOW
            if (formData.role === 'student') {
                if (step === 1) {
                    await handleSendOtp();
                    return;
                }

                // Verify OTP
                const data = await authService.verifyStudentOtp(formData.email, formData.otp);
                login('student', { username: formData.email });
                navigate('/student');
            }

            // TEACHER/ADMIN FLOW
            else {
                if (formData.role === 'admin' && step === 1) {
                    await authService.login(formData.username, formData.password);
                    // Note: If backend enforced MFA for admin on login endpoint, we handle it. 
                    // The prompt says "Keep existing password + terminal OTP MFA".
                    // The previous code had a client-side step 2 for admin OTP. Keeping that logic if backend supports it.
                    // Assuming standard login first step validates password.
                    setStep(2);
                    setLoading(false);
                    return;
                }

                if (formData.role === 'admin' && step === 2) {
                    await authService.verifyOtp(formData.otp);
                    login('admin', { username: formData.username });
                    navigate('/admin');
                    return;
                }

                // Teacher
                const data = await authService.login(formData.username, formData.password);
                const userRole = data.role;
                login(userRole, { username: formData.username });
                if (userRole === 'teacher') navigate('/teacher');
                // Fallback for others
                else if (userRole === 'admin') navigate('/admin');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Authentication failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md relative">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-cyber-blue/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 -right-4 w-72 h-72 bg-cyber-purple/20 rounded-full blur-[100px] pointer-events-none" />

                <Card className="border-cyber-blue/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-cyber-blue/10 rounded-2xl mx-auto flex items-center justify-center border border-cyber-blue/50 shadow-[0_0_20px_rgba(0,243,255,0.3)] mb-4">
                            <Shield size={32} className="text-cyber-blue" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            SYSTEM <span className="text-cyber-blue">ACCESS</span>
                        </h1>
                        <p className="text-cyber-blue/60 font-mono text-xs tracking-[0.2em] mt-2">SECURE AUTHENTICATION GATEWAY</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {error && (
                            <div className="bg-cyber-red/10 border border-cyber-red/50 p-3 rounded text-cyber-red text-sm flex items-center gap-2">
                                <Lock size={14} />
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-cyber-green/10 border border-cyber-green/50 p-3 rounded text-cyber-green text-sm flex items-center gap-2">
                                <Shield size={14} />
                                {message}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-black/40 rounded-lg border border-white/10">
                                {['student', 'teacher', 'admin'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, role: r });
                                            setError('');
                                            setMessage('');
                                        }}
                                        className={`
                    py-2 text-xs font-bold uppercase tracking-wider rounded transition-all
                    ${formData.role === r
                                                ? 'bg-cyber-blue text-black shadow-[0_0_10px_rgba(0,243,255,0.5)]'
                                                : 'text-gray-500 hover:text-white hover:bg-white/5'}
                  `}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* STUDENT FLOW */}
                        {formData.role === 'student' && (
                            <>
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <Input
                                            label="Student Email"
                                            icon={User}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="cb.sc.u4cse...@cb.students.amrita.edu"
                                            required
                                        />
                                        <Input
                                            label="Password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter Security Key"
                                            required
                                        />
                                    </div>
                                )}
                                {step === 2 && (
                                    <Input
                                        label="One-Time Password (Email)"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="Enter 6-digit OTP"
                                        className="text-center text-xl tracking-[0.3em] font-mono"
                                        autoFocus
                                        required
                                    />
                                )}
                            </>
                        )}

                        {/* TEACHER/ADMIN FLOW */}
                        {formData.role !== 'student' && (
                            <>
                                {step === 1 && (
                                    <div className="space-y-4">
                                        <Input
                                            label="Username"
                                            icon={User}
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Enter Access ID"
                                            required
                                        />
                                        <Input
                                            label="Password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter Security Key"
                                            required
                                        />
                                    </div>
                                )}
                                {step === 2 && formData.role === 'admin' && (
                                    <Input
                                        label="Admin OTP Verification"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="Enter Terminal OTP"
                                        className="text-center text-2xl tracking-[0.5em] font-mono"
                                        autoFocus
                                        required
                                    />
                                )}
                            </>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base mt-2"
                            isLoading={loading}
                        >
                            {step === 1
                                ? (formData.role === 'student' ? 'VERIFY & SEND CODE' : 'INITIATE SESSION')
                                : 'VERIFY ACCESS'}
                        </Button>

                        {step === 1 && (
                            <div className="text-center mt-4">
                                <Link
                                    to="/register"
                                    className="text-xs text-gray-500 hover:text-cyber-blue underline decoration-transparent hover:decoration-cyber-blue transition-all"
                                >
                                    New here? Register Account
                                </Link>
                            </div>
                        )}

                        {step === 2 && (
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-xs text-gray-500 hover:text-cyber-blue mt-4 underline decoration-transparent hover:decoration-cyber-blue transition-all"
                            >
                                Return to Login / Resend
                            </button>
                        )}

                    </form>
                </Card>
            </div>
        </div>
    );
}
