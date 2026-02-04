'use client';

import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import TeacherLayout from '@/components/Layout/TeacherLayout';
import VideoCard from '@/components/Teacher/VideoCard';
import Link from 'next/link';
import { HiPlus, HiFunnel } from 'react-icons/hi2';

export default function MyVideosPage() {
    const { data: videos, loading } = useFetch(() => api.getTeacherVideos());

    return (
        <TeacherLayout activeTab="videos">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900">My Videos</h1>
                        <p className="text-secondary-600">Manage your uploaded content and track earnings.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* <button className="flex items-center gap-2 px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors">
                            <HiFunnel className="w-5 h-5" />
                            Filter
                        </button> */}
                        <Link href="/teacher/upload">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                                <HiPlus className="w-5 h-5" />
                                Upload Video
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-secondary-100 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos?.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && videos?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-secondary-200">
                        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiPlus className="w-8 h-8 text-secondary-400" />
                        </div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-1">No videos yet</h3>
                        <p className="text-secondary-500 mb-4">Upload your first video to start earning.</p>
                        <Link href="/teacher/upload">
                            <button className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                                Upload First Video
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
