'use client';

import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import Link from 'next/link';
import { HiPlay } from 'react-icons/hi2';
import { MdVideoLibrary } from 'react-icons/md';

export default function ContinueWatching() {
    const { data: sessions, loading } = useFetch(() => api.getContinueWatching());

    if (loading) {
        return <div className="text-secondary-500">Loading...</div>;
    }

    if (!sessions || sessions.length === 0) {
        return (
            <div className="text-center py-8 text-secondary-500">
                <p>No sessions in progress</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <Link key={session.sessionId} href={`/session/${session.sessionId}`}>
                    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
                        {/* Thumbnail */}
                        <div className="w-32 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded flex items-center justify-center flex-shrink-0">
                            <MdVideoLibrary className="text-3xl text-primary-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h4 className="font-semibold text-secondary-900 mb-1">{session.sessionTitle}</h4>
                            <p className="text-sm text-secondary-600 mb-2">{session.courseName}</p>

                            {/* Progress */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-secondary-200 rounded-full h-1.5">
                                    <div
                                        className="bg-primary-600 h-1.5 rounded-full"
                                        style={{ width: `${session.progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-secondary-500">{session.progress}%</span>
                            </div>
                        </div>

                        {/* Resume Button */}
                        <div className="flex items-center">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                                <HiPlay className="w-4 h-4" /> Resume
                            </button>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
