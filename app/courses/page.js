'use client';

import DashboardLayout from '@/components/Layout/DashboardLayout';
import CourseCard from '@/components/Course/CourseCard';
import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';

export default function CoursesPage() {
    const { data: courses, loading } = useFetch(() => api.getEnrolledCourses());

    return (
        <DashboardLayout activeTab="courses">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">My Courses</h1>
                    <p className="text-secondary-600">Your enrolled and saved courses</p>
                </div>

                {/* Courses Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-96 bg-secondary-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : !courses || courses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-soft p-12 text-center">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">No courses yet</h3>
                        <p className="text-secondary-600 mb-6">Start exploring and enroll in courses to see them here</p>
                        <a
                            href="/dashboard"
                            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            Explore Courses
                        </a>
                    </div>
                ) : (
                    <div>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-6 rounded-lg shadow-soft">
                                <p className="text-secondary-600 text-sm mb-1">Total Courses</p>
                                <p className="text-3xl font-bold text-secondary-900">{courses.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-soft">
                                <p className="text-secondary-600 text-sm mb-1">In Progress</p>
                                <p className="text-3xl font-bold text-secondary-900">
                                    {courses.filter(c => c.progress > 0 && c.progress < 100).length}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-soft">
                                <p className="text-secondary-600 text-sm mb-1">Completed</p>
                                <p className="text-3xl font-bold text-secondary-900">
                                    {courses.filter(c => c.progress === 100).length}
                                </p>
                            </div>
                        </div>

                        {/* Course Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} showProgress={true} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
