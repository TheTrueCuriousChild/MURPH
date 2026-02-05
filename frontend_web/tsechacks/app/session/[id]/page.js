'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/Session/VideoPlayer';
import SessionTimer from '@/components/Session/SessionTimer';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { HiArrowLeft, HiCheckCircle } from 'react-icons/hi2';
import { API_URL } from '@/lib/config';

export default function SessionPage() {
    const params = useParams();
    const router = useRouter();
    const { id: sessionId } = params;

    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [ending, setEnding] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${API_URL}/session/${sessionId}`, {
                    headers: headers
                });

                const data = await response.json();
                if (data.success) {
                    setSessionData(data.data);
                } else {
                    // If session not found or invalid
                    alert("Invalid Session");
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchSession();
        }
    }, [sessionId, router]);

    const handleEndSession = async () => {
        if (!confirm("Are you sure you want to end this session? This will finalize your payment.")) return;

        setEnding(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/session/${sessionId}/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                // Should ideally show a summary modal here, but resolving to back for now
                router.push('/dashboard'); // Or viewing history
            } else {
                alert(data.message || "Failed to end session");
            }
        } catch (error) {
            console.error("End session error:", error);
        } finally {
            setEnding(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!sessionData) return null;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Minimal Header for Focus Mode */}
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg">{sessionData.lecture?.title || 'Lecture Session'}</h1>
                        <p className="text-xs text-gray-400">{sessionData.lecture?.course?.title || 'Course'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-500/30 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-400 tracking-wide uppercase">Live Session</span>
                    </div>
                    {/* Timer could go here */}
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Video */}
                    <div className="lg:col-span-2 space-y-6">
                        <VideoPlayer sessionId={sessionId} />

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h2 className="text-xl font-bold mb-2">Description</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {sessionData.lecture?.description || 'No description available.'}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar - Controls & Status */}
                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <h3 className="font-bold text-gray-200 mb-4">Session Control</h3>

                            <p className="text-sm text-gray-400 mb-6">
                                You are currently paying
                                <span className="text-white font-bold mx-1">${sessionData.lecture?.pricePerMinute}/min</span>
                                for this session. Pause the video to pause billing.
                            </p>

                            <button
                                onClick={handleEndSession}
                                disabled={ending}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                            >
                                {ending ? (
                                    <span>Processing...</span>
                                ) : (
                                    <>
                                        <HiCheckCircle className="w-5 h-5" />
                                        End Session & Pay
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Q&A or Notes placeholder */}
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 opacity-50">
                            <h3 className="font-bold text-gray-400 mb-2">Notes & Q&A</h3>
                            <p className="text-sm text-gray-500">Coming soon...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
