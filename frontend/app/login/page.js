'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/UI/Button';
import { HiUser, HiAcademicCap } from 'react-icons/hi2';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // 'student' or 'teacher'
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call authentication
        setTimeout(() => {
            // Store role in localStorage for session management
            if (typeof window !== 'undefined') {
                localStorage.setItem('userRole', role);
                localStorage.setItem('isAuthenticated', 'true');

                // Debug log
                console.log('Logged in as:', role);
            }

            // Route based on role
            if (role === 'teacher') {
                router.push('/teacher/dashboard');
            } else {
                router.push('/dashboard');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Welcome Back</h1>
                    <p className="text-secondary-600">Sign in to continue learning</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-3">
                            I am a:
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Student Role */}
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${role === 'student'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-secondary-200 bg-white hover:border-primary-300'
                                    }`}
                            >
                                <div className={`p-2 rounded-full ${role === 'student' ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                                    <HiAcademicCap className={`w-6 h-6 ${role === 'student' ? 'text-primary-600' : 'text-secondary-400'}`} />
                                </div>
                                <span className={`font-medium ${role === 'student' ? 'text-primary-700' : 'text-secondary-600'}`}>
                                    Student
                                </span>
                            </button>

                            {/* Teacher Role */}
                            <button
                                type="button"
                                onClick={() => setRole('teacher')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${role === 'teacher'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-secondary-200 bg-white hover:border-primary-300'
                                    }`}
                            >
                                <div className={`p-2 rounded-full ${role === 'teacher' ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                                    <HiUser className={`w-6 h-6 ${role === 'teacher' ? 'text-primary-600' : 'text-secondary-400'}`} />
                                </div>
                                <span className={`font-medium ${role === 'teacher' ? 'text-primary-700' : 'text-secondary-600'}`}>
                                    Teacher
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : `Sign in as ${role === 'student' ? 'Student' : 'Teacher'}`}
                    </Button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-secondary-600 mt-6">
                    Don't have an account?{' '}
                    <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
