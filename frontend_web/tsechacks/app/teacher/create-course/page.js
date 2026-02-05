'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi2';
import { API_URL } from '@/lib/config';

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title || !description) return;

        setLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
            // Fallback for cookie-based auth where token might be in cookie only
            // But we try to send it if we have it.

            const headers = {
                'Content-Type': 'application/json',
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/teacher/courses`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ title, description }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Course created successfully!');
                router.push('/teacher/my-courses');
            } else {
                alert(data.message || 'Failed to create course');
            }
        } catch (error) {
            console.error('Create course error:', error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
            >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                Back
            </button>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-secondary-900 mb-6">Create New Course</h1>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Course Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                            placeholder="e.g., Advanced React Patterns"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-2 rounded-lg border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                            placeholder="What will students learn in this course?"
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
