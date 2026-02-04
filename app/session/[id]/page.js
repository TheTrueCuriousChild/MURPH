'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SessionTimer from '@/components/Session/SessionTimer';
import VideoPlayer from '@/components/Session/VideoPlayer';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import { useSessionTimer } from '@/lib/hooks';
import api, { MOCK_DATA } from '@/lib/api';

export default function SessionPage({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const sessionId = parseInt(unwrappedParams.id);
    const [session, setSession] = useState(null);
    const [course, setCourse] = useState(null);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [lockedAmount, setLockedAmount] = useState(5.99);

    const { elapsedTime, isRunning, start, pause, stop } = useSessionTimer(0);

    useEffect(() => {
        // Fetch session data
        const sessionData = MOCK_DATA.sessions.find(s => s.id === sessionId);
        setSession(sessionData);

        if (sessionData) {
            const courseData = MOCK_DATA.courses.find(c => c.id === sessionData.courseId);
            setCourse(courseData);
            setLockedAmount(courseData?.pricePerSession || 5.99);
        }
    }, [sessionId]);

    const handleStartSession = async () => {
        const result = await api.startSession(sessionId);
        if (result.success) {
            start();
        }
    };

    const handleFinishSession = async () => {
        const result = await api.finishSession(sessionId);
        if (result.success) {
            stop();
            setShowFinishModal(false);
            router.push('/dashboard');
        }
    };

    if (!session || !course) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">Loading session...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activeTab="dashboard">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-4 text-sm text-secondary-600">
                    <a href="/dashboard" className="hover:text-primary-600">Dashboard</a>
                    <span className="mx-2">/</span>
                    <a href={`/course/${course.id}`} className="hover:text-primary-600">{course.title}</a>
                    <span className="mx-2">/</span>
                    <span className="text-secondary-900">{session.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Session Timer */}
                        <SessionTimer
                            elapsedTime={elapsedTime}
                            isRunning={isRunning}
                            lockedAmount={lockedAmount}
                        />

                        {/* Video Player */}
                        <VideoPlayer
                            videoUrl={session.videoUrl}
                            onPlay={handleStartSession}
                            onPause={pause}
                        />

                        {/* Session Info */}
                        <div className="bg-white rounded-lg shadow-soft p-6">
                            <h1 className="text-2xl font-bold text-secondary-900 mb-2">{session.title}</h1>
                            <p className="text-secondary-600 mb-4">{course.title} • {course.instructor}</p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {!isRunning ? (
                                    <Button variant="primary" onClick={handleStartSession}>
                                        Start Session
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="secondary" onClick={pause}>
                                            Pause
                                        </Button>
                                        <Button variant="danger" onClick={() => setShowFinishModal(true)}>
                                            Finish Session
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Session Details */}
                            <div className="mt-6 pt-6 border-t border-secondary-200">
                                <h3 className="font-semibold text-secondary-900 mb-3">Session Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-secondary-600">Duration</p>
                                        <p className="font-medium text-secondary-900">{Math.floor(session.duration / 60)} minutes</p>
                                    </div>
                                    <div>
                                        <p className="text-secondary-600">Price</p>
                                        <p className="font-medium text-secondary-900">${lockedAmount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Course Sessions */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-soft p-6 sticky top-6">
                            <h3 className="font-semibold text-secondary-900 mb-4">Course Sessions</h3>
                            <div className="space-y-2">
                                {MOCK_DATA.sessions
                                    .filter(s => s.courseId === course.id)
                                    .map((s, index) => (
                                        <button
                                            key={s.id}
                                            onClick={() => router.push(`/session/${s.id}`)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${s.id === sessionId
                                                ? 'bg-primary-50 border border-primary-200'
                                                : 'hover:bg-secondary-50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${s.completed ? 'bg-success-100 text-success-700' : 'bg-secondary-100 text-secondary-600'
                                                    }`}>
                                                    {s.completed ? '✓' : index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-secondary-900 line-clamp-2">{s.title}</p>
                                                    <p className="text-xs text-secondary-500 mt-1">{Math.floor(s.duration / 60)} min</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Finish Session Modal */}
            <Modal
                isOpen={showFinishModal}
                onClose={() => setShowFinishModal(false)}
                title="Finish Session"
            >
                <div className="space-y-4">
                    <p className="text-secondary-700">
                        Are you sure you want to finish this session? The locked amount of <strong>${lockedAmount}</strong> will be charged.
                    </p>
                    <div className="bg-secondary-50 p-4 rounded-lg">
                        <p className="text-sm text-secondary-600">Time spent: {Math.floor(elapsedTime / 60)} minutes</p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setShowFinishModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="success" onClick={handleFinishSession}>
                            Confirm & Finish
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
