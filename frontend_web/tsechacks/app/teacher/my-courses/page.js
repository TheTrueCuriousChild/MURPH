'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiPlus, HiBookOpen } from 'react-icons/hi2';
import Link from 'next/link';
import { API_URL } from '@/lib/config';

export default function MyCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${API_URL}/teacher/courses`, {
                    headers: headers
                });
                const data = await response.json();

                if (data.success) {
                    setCourses(data.data);
                }
            } catch (error) {
                console.error('Fetch courses error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">My Courses</h1>
                    <p className="text-secondary-600">Manage your created courses</p>
                </div>
                <Link
                    href="/teacher/create-course"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                >
                    <HiPlus className="w-5 h-5" />
                    Create New Course
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border-2 border-dashed border-secondary-200">
                    <div className="p-4 bg-primary-50 rounded-full mb-4">
                        <HiBookOpen className="w-12 h-12 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">No Courses Yet</h3>
                    <p className="text-secondary-600 mb-6 text-center max-w-sm">
                        Create your first course to start organizing your lectures and content.
                    </p>
                    <Link
                        href="/teacher/create-course"
                        className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                    >
                        Create Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary-50 rounded-lg">
                                    <HiBookOpen className="w-6 h-6 text-primary-600" />
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-secondary-100 text-secondary-600 rounded-full">
                                    {course._count?.lectures || 0} Lectures
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-secondary-900 mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-secondary-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                {course.description}
                            </p>
                            <div className="border-t border-secondary-100 pt-4 flex justify-end">
                                <button className="text-primary-600 font-medium hover:text-primary-700 text-sm">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
