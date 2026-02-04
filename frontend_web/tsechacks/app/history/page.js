'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import Link from 'next/link';

export default function HistoryPage() {
    const { data: history, loading } = useFetch(() => api.getViewingHistory());

    return (
        <DashboardLayout activeTab="history">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Viewing History</h1>
                    <p className="text-secondary-600">Track your learning progress</p>
                </div>

                {/* History List */}
                <div className="bg-white rounded-lg shadow-soft overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-secondary-500">Loading history...</div>
                    ) : !history || history.length === 0 ? (
                        <div className="p-8 text-center text-secondary-500">
                            <div className="text-4xl mb-2">📜</div>
                            <p>No viewing history yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-secondary-200">
                            {history.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-secondary-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Content */}
                                        <div className="flex-1">
                                            <Link
                                                href={`/session/${item.sessionId}`}
                                                className="text-lg font-semibold text-secondary-900 hover:text-primary-600 transition-colors"
                                            >
                                                {item.sessionTitle}
                                            </Link>
                                            <p className="text-secondary-600 mt-1">{item.courseName}</p>

                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 mt-3 text-sm text-secondary-500">
                                                <span className="flex items-center gap-1">
                                                    📅 {new Date(item.watchedAt).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    ⏱️ {Math.floor(item.duration / 60)} minutes
                                                </span>
                                                <span className={`flex items-center gap-1 ${item.completed ? 'text-success-600' : 'text-warning-600'}`}>
                                                    {item.completed ? '✓ Completed' : '⊙ In Progress'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Re-watch Button */}
                                        <Link href={`/session/${item.sessionId}`}>
                                            <button className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                                                Re-watch
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
