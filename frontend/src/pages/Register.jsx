import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authService } from '../api/auth';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authService.register(formData.username, formData.password, formData.role);
            // On success, redirect to login
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md relative">
                {/* Visual Effects */}
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyber-purple/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 -left-4 w-72 h-72 bg-cyber-blue/20 rounded-full blur-[100px] pointer-events-none" />

                <Card className="border-cyber-purple/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-cyber-purple/10 rounded-2xl mx-auto flex items-center justify-center border border-cyber-purple/50 shadow-[0_0_20px_rgba(180,0,255,0.3)] mb-4">
                            <UserPlus size={32} className="text-cyber-purple" />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            NEW <span className="text-cyber-purple">MEMBER</span>
                        </h1>
                        <p className="text-cyber-purple/60 font-mono text-xs tracking-[0.2em] mt-2">REQUEST SYSTEM ACCESS</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6 relative z-10">
                        {error && (
                            <div className="bg-cyber-red/10 border border-cyber-red/50 p-3 rounded text-cyber-red text-sm flex items-center gap-2">
                                <Lock size={14} />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-black/40 rounded-lg border border-white/10">
                            {['student', 'teacher', 'admin'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: r })}
                                    className={`
                        py-2 text-xs font-bold uppercase tracking-wider rounded transition-all
                        ${formData.role === r
                                            ? 'bg-cyber-purple text-black shadow-[0_0_10px_rgba(180,0,255,0.5)]'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'}
                      `}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <Input
                                label={formData.role === 'student' ? "Student Email" : "Username"}
                                icon={User}
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder={formData.role === 'student' ? "cb.sc.u4cse...@cb.students.amrita.edu" : "Choose Access ID"}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create Security Key"
                                required
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Security Key"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="secondary"
                            className="w-full h-12 text-base mt-2"
                            isLoading={loading}
                        >
                            REGISTER ACCOUNT
                        </Button>

                        <div className="text-center mt-4">
                            <Link
                                to="/login"
                                className="text-xs text-gray-500 hover:text-cyber-purple underline decoration-transparent hover:decoration-cyber-purple transition-all"
                            >
                                Already have an account? Login here
                            </Link>
                        </div>

                    </form>
                </Card>
            </div>
        </div>
    );
}
