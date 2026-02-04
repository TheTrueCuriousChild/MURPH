'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import ContinueWatching from '@/components/Course/ContinueWatching';
import ExploreCourses from '@/components/Course/ExploreCourses';
import { useWallet } from '@/lib/hooks';
import { HiWallet, HiLockClosed, HiArrowRight } from 'react-icons/hi2';
import { FaGraduationCap } from 'react-icons/fa';

export default function DashboardPage() {
    const { balance, lockedAmount, loading } = useWallet();

    return (
        <DashboardLayout activeTab="dashboard">
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Welcome back, John!</h1>
                    <p className="text-secondary-600">Continue your learning journey</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm mb-1">Available Balance</p>
                                <p className="text-2xl font-bold text-secondary-900">
                                    {loading ? '...' : `₹${(balance - lockedAmount).toFixed(2)}`}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                                <HiWallet className="w-6 h-6 text-secondary-900" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm mb-1">Locked Amount</p>
                                <p className="text-2xl font-bold text-secondary-900">
                                    {loading ? '...' : `₹${lockedAmount.toFixed(2)}`}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                                <HiLockClosed className="w-6 h-6 text-secondary-900" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-soft">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-secondary-600 text-sm mb-1">Courses Enrolled</p>
                                <p className="text-2xl font-bold text-secondary-900">2</p>
                            </div>
                            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                                <FaGraduationCap className="w-6 h-6 text-secondary-900" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Watching */}
                <section>
                    <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Continue Watching</h2>
                    <ContinueWatching />
                </section>

                {/* Explore Courses */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold text-secondary-900">Explore Courses</h2>
                        <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                            View All <HiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    <ExploreCourses />
                </section>
            </div>
        </DashboardLayout>
    );
}
