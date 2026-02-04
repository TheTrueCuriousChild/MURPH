'use client';

import { useState, use } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Corrected import
import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import TeacherLayout from '@/components/Layout/TeacherLayout';
import ReviewsList from '@/components/Teacher/ReviewsList';
import QASection from '@/components/Teacher/QASection';
import VideoPlayer from '@/components/Session/VideoPlayer';
import { HiStar, HiEye, HiCurrencyRupee, HiClock, HiCalendar, HiPlay } from 'react-icons/hi2';

export default function VideoDetailsPage({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;

    // Fetch video details (filter from list for now)
    const { data: videos, loading } = useFetch(() => api.getTeacherVideos());
    const video = videos?.find(v => v.id === parseInt(id));

    const [isPlaying, setIsPlaying] = useState(false);

    if (loading) return <div>Loading...</div>;
    if (!video) return <div>Video not found</div>;

    return (
        <TeacherLayout activeTab="videos">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Info */}
                <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Video Player / Thumbnail */}
                        <div className="w-full md:w-1/2 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {isPlaying ? (
                                <VideoPlayer
                                    videoUrl={video.videoUrl}
                                    onPlay={() => { }}
                                    onPause={() => setIsPlaying(false)}
                                />
                            ) : (
                                <div className="relative w-full aspect-video bg-gray-100 group cursor-pointer" onClick={() => setIsPlaying(true)}>
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                                            <HiPlay className="w-8 h-8 text-primary-600 ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {video.duration} min
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-secondary-900 mb-2">{video.title}</h1>

                                <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                                    <span className="flex items-center gap-1">
                                        <HiCalendar className="w-4 h-4" />
                                        {video.uploadDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <HiClock className="w-4 h-4" />
                                        {video.duration} min
                                    </span>
                                    <span className="flex items-center gap-1 text-primary-600 font-medium">
                                        <HiCurrencyRupee className="w-4 h-4" />
                                        ₹{video.pricePerMinute}/min
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 border-t border-secondary-100 pt-6">
                                <div>
                                    <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Total Earnings</p>
                                    <p className="text-xl font-bold text-success-600 flex items-center">
                                        <HiCurrencyRupee className="w-5 h-5" />
                                        {video.earnings.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Views</p>
                                    <p className="text-xl font-bold text-primary-600 flex items-center gap-1">
                                        <HiEye className="w-5 h-5" />
                                        {video.views.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">Rating</p>
                                    <p className="text-xl font-bold text-warning-500 flex items-center gap-1">
                                        <HiStar className="w-5 h-5" />
                                        {video.rating}
                                    </p>
                                </div>
                            </div>

                            {/* Description (Overview) */}
                            <div className="border-t border-secondary-100 pt-6">
                                <h3 className="font-bold text-secondary-900 mb-2">Description</h3>
                                <p className="text-secondary-600 leading-relaxed text-sm">
                                    {video.description || "This is a comprehensive guide covering all aspects of the topic. Designed for students of all levels, this video provides deep insights and practical examples. Students will learn key concepts, best practices, and real-world applications."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stacked Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Reviews Section */}
                    <div className="bg-white rounded-xl border border-secondary-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-secondary-900">Reviews</h2>
                            <span className="text-sm text-secondary-500">{video.reviews?.length || 0} reviews</span>
                        </div>
                        <ReviewsList reviews={video.reviews} />
                    </div>

                    {/* Q&A Section */}
                    <div className="bg-white rounded-xl border border-secondary-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-secondary-900">Q&A</h2>
                            <span className="text-sm text-secondary-500">{video.questions?.length || 0} questions</span>
                        </div>
                        <QASection questions={video.questions} />
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
