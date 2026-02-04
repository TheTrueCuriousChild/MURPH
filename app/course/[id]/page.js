'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import { MOCK_DATA } from '@/lib/api';

export default function CoursePage({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const courseId = parseInt(unwrappedParams.id);
    const course = MOCK_DATA.courses.find(c => c.id === courseId);
    const courseSessions = MOCK_DATA.sessions.filter(s => s.courseId === courseId);

    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    if (!course) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">Course not found</div>
            </DashboardLayout>
        );
    }

    const handleStartSession = (session) => {
        setSelectedSession(session);
        setShowStartModal(true);
    };

    const confirmStartSession = () => {
        if (selectedSession) {
            router.push(`/session/${selectedSession.id}`);
        }
    };

    return (
        <DashboardLayout activeTab="courses">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Course Header */}
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg p-8 text-white">
                    <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                            {course.category}
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
                    <p className="text-primary-100 text-lg mb-6">{course.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span>👤</span>
                            <span>{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>⭐</span>
                            <span>{course.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>📚</span>
                            <span>{course.totalSessions} sessions</span>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Section */}
                        <div className="bg-white rounded-lg shadow-soft p-6">
                            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">About This Course</h2>
                            <p className="text-secondary-700 leading-relaxed mb-6">
                                {course.description}
                            </p>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-secondary-900">What you'll learn:</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-secondary-700">
                                        <span className="text-success-600 mt-1">✓</span>
                                        <span>Master core concepts and advanced techniques</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-secondary-700">
                                        <span className="text-success-600 mt-1">✓</span>
                                        <span>Build real-world projects</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-secondary-700">
                                        <span className="text-success-600 mt-1">✓</span>
                                        <span>Industry best practices</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Sessions List */}
                        <div className="bg-white rounded-lg shadow-soft p-6">
                            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Course Sessions</h2>
                            <div className="space-y-3">
                                {courseSessions.map((session, index) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:border-primary-300 transition-colors"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${session.completed ? 'bg-success-100 text-success-700' : 'bg-secondary-100 text-secondary-600'
                                                }`}>
                                                {session.completed ? '✓' : index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-secondary-900">{session.title}</h4>
                                                <p className="text-sm text-secondary-500">{Math.floor(session.duration / 60)} minutes</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant={session.completed ? 'secondary' : 'primary'}
                                            size="sm"
                                            onClick={() => handleStartSession(session)}
                                        >
                                            {session.completed ? 'Rewatch' : 'Start'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-soft p-6 sticky top-6">
                            <div className="text-center mb-6">
                                <p className="text-sm text-secondary-600 mb-2">Pay per session</p>
                                <p className="text-4xl font-bold text-primary-600 mb-1">${course.pricePerSession}</p>
                                <p className="text-sm text-secondary-500">per session</p>
                            </div>

                            {course.enrolled ? (
                                <>
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-secondary-600 mb-2">
                                            <span>Your Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-secondary-200 rounded-full h-3">
                                            <div
                                                className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <Button variant="primary" className="w-full mb-3">
                                        Continue Learning
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    className="w-full mb-3"
                                    onClick={() => setShowEnrollModal(true)}
                                >
                                    Enroll Now
                                </Button>
                            )}

                            <div className="pt-6 border-t border-secondary-200 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Total Sessions</span>
                                    <span className="font-medium text-secondary-900">{course.totalSessions}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Total Cost</span>
                                    <span className="font-medium text-secondary-900">${course.price}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary-600">Instructor</span>
                                    <span className="font-medium text-secondary-900">{course.instructor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enroll Modal */}
            <Modal
                isOpen={showEnrollModal}
                onClose={() => setShowEnrollModal(false)}
                title="Enroll in Course"
            >
                <div className="space-y-4">
                    <p className="text-secondary-700">
                        This course uses pay-as-you-use pricing. You'll only be charged when you complete each session.
                    </p>
                    <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-sm text-secondary-700">
                            <strong>${course.pricePerSession}</strong> per session × {course.totalSessions} sessions
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">Total if you complete all: ${course.price}</p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => {
                            setShowEnrollModal(false);
                            // In real app, would call API to enroll
                        }}>
                            Enroll Now
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Start Session Modal */}
            <Modal
                isOpen={showStartModal}
                onClose={() => setShowStartModal(false)}
                title="Start Session"
            >
                <div className="space-y-4">
                    <p className="text-secondary-700">
                        Ready to start <strong>{selectedSession?.title}</strong>?
                    </p>
                    <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
                        <p className="text-sm text-secondary-700">
                            <strong>${course.pricePerSession}</strong> will be locked from your wallet during this session.
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                            The amount will be charged when you finish the session.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setShowStartModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={confirmStartSession}>
                            Start Session
                        </Button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
