'use client';

import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import TeacherLayout from '@/components/Layout/TeacherLayout';
import Card from '@/components/UI/Card';
import VideoCard from '@/components/Teacher/VideoCard';
import Link from 'next/link';
import { HiCurrencyRupee, HiEye, HiVideoCamera, HiStar, HiArrowUp, HiPlus } from 'react-icons/hi2';

export default function TeacherDashboard() {
    const { data: profile, loading: profileLoading } = useFetch(() => api.getTeacherProfile());
    const { data: earnings, loading: earningsLoading } = useFetch(() => api.getTeacherEarnings());
    const { data: videos, loading: videosLoading } = useFetch(() => api.getTeacherVideos());

    const loading = profileLoading || earningsLoading || videosLoading;

    if (loading) {
        return (
            <TeacherLayout activeTab="dashboard">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </TeacherLayout>
        );
    }

    const stats = [
        {
            label: 'Total Earnings',
            value: '₹12,450',
            icon: HiCurrencyRupee,
            color: 'text-secondary-900',
            bg: 'bg-secondary-100',
            trend: '+12% this month'
        },
        {
            label: 'Total Views',
            value: '45.2k',
            icon: HiEye,
            color: 'text-secondary-900',
            bg: 'bg-secondary-100',
            trend: '+150 new views'
        },
        {
            label: 'Total Videos',
            value: '24',
            icon: HiVideoCamera,
            color: 'text-secondary-900',
            bg: 'bg-secondary-100',
            trend: 'Last upload 2 days ago'
        },
        {
            label: 'Avg Rating',
            value: '4.8',
            icon: HiStar,
            color: 'text-secondary-900',
            bg: 'bg-secondary-100',
            trend: 'Based on 1.2k reviews'
        }
    ];

    return (
        <TeacherLayout activeTab="dashboard">
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900">
                            Welcome back, {profile?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-secondary-600">
                            Here's how your content is performing today.
                        </p>
                    </div>
                    <Link href="/teacher/upload">
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
                            <HiPlus className="w-5 h-5" />
                            Upload New Video
                        </button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={i} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-medium text-secondary-600 bg-secondary-50 px-2 py-1 rounded-full">
                                        <HiArrowUp className="w-3 h-3" />
                                        {stat.trend}
                                    </span>
                                </div>
                                <h3 className="text-secondary-500 text-sm font-medium mb-1">{stat.label}</h3>
                                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Videos */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-secondary-900">Recent Videos</h2>
                        <Link href="/teacher/videos" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos?.slice(0, 4).map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
