'use client';

import TeacherLayout from '@/components/Layout/TeacherLayout';
import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import { HiStar, HiUser, HiUsers, HiVideoCamera, HiCalendar } from 'react-icons/hi2';

export default function TeacherProfilePage() {
    const { data: profile, loading } = useFetch(() => api.getTeacherProfile());

    if (loading) return <div>Loading...</div>;

    return (
        <TeacherLayout activeTab="dashboard">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Header */}
                <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
                    <div className="h-32 bg-primary-600"></div>
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-start gap-6 -mt-12">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                                {profile?.avatar ? (
                                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-secondary-100 flex items-center justify-center text-secondary-400">
                                        <HiUser className="w-12 h-12" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 mt-2">
                                <h1 className="text-2xl font-bold text-secondary-900">{profile?.name}</h1>
                                <p className="text-secondary-600">{profile?.email}</p>
                                <div className="flex gap-4 mt-3">
                                    <span className="flex items-center gap-1 text-sm text-secondary-600">
                                        <HiCalendar className="w-4 h-4" />
                                        Joined Dec 2023
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-warning-600 font-medium">
                                        <HiStar className="w-4 h-4 text-warning-500" />
                                        {profile?.rating} Instructor Rating
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-12">
                                <button className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors text-sm font-medium text-secondary-700">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-secondary-200 text-center">
                        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiUsers className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-secondary-900">{profile?.totalStudents?.toLocaleString()}</p>
                        <p className="text-sm text-secondary-500">Total Students</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-secondary-200 text-center">
                        <div className="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiVideoCamera className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-secondary-900">{profile?.totalVideos}</p>
                        <p className="text-sm text-secondary-500">Uploaded Videos</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-secondary-200 text-center">
                        <div className="w-12 h-12 bg-warning-50 text-warning-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HiStar className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-bold text-secondary-900">{profile?.rating}</p>
                        <p className="text-sm text-secondary-500">Average Rating</p>
                    </div>
                </div>

                {/* Bio & Details (Placeholder) */}
                <div className="bg-white p-8 rounded-xl border border-secondary-200">
                    <h3 className="text-lg font-bold text-secondary-900 mb-4">About Me</h3>
                    <p className="text-secondary-600 leading-relaxed">
                        Experienced instructor with a passion for teaching web development and data science.
                        Helping students master complex topics through practical, project-based learning.
                    </p>
                </div>
            </div>
        </TeacherLayout>
    );
}
