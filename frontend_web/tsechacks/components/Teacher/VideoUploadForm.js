'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HiCloudArrowUp, HiXMark } from 'react-icons/hi2';
import { API_URL } from '@/lib/config';

export default function VideoUploadForm({ preSelectedCourseId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [courses, setCourses] = useState([]);

    // Separate state for file inputs to handle them properly
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pricePerMinute: '',
        category: '',
        courseId: preSelectedCourseId || '',
        tags: '',
        videoFile: null,
        thumbnailFile: null
    });

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
            }
        };
        fetchCourses();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFormData({ ...formData, videoFile: e.dataTransfer.files[0] });
        }
    };

    const handleChange = (e) => {
        if (e.target.files) {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const removeFile = (field) => {
        setFormData({ ...formData, [field]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('pricePerMinute', formData.pricePerMinute);
            data.append('category', formData.category);
            data.append('courseId', formData.courseId);
            data.append('tags', formData.tags);

            if (formData.videoFile) {
                // 'lecture' is the field name expected by the backend
                data.append('lecture', formData.videoFile);
            } else {
                alert('Please select a video file');
                setLoading(false);
                return;
            }

            // If thumbnail is supported by backend later
            if (formData.thumbnailFile) {
                data.append('thumbnail', formData.thumbnailFile);
            }

            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            // Do NOT set Content-Type for FormData, browser sets it with boundary

            const response = await fetch(`${API_URL}/teacher/lectures`, {
                method: 'POST',
                headers: headers,
                body: data,
            });

            const result = await response.json();

            if (result.success) {
                alert('Video uploaded successfully!');
                router.push('/teacher/my-courses');
            } else {
                alert(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('An error occurred during upload');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Video Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-secondary-300 hover:border-primary-400'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    name="videoFile"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleChange}
                    accept="video/*"
                />

                {formData.videoFile ? (
                    <div className="bg-primary-50 p-4 rounded-lg inline-flex items-center gap-3">
                        <div className="bg-white p-2 rounded shadow-sm">
                            <HiCloudArrowUp className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-primary-900">{formData.videoFile.name}</p>
                            <p className="text-xs text-primary-600">{(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                removeFile('videoFile');
                            }}
                            className="p-1 hover:bg-white rounded-full transition-colors z-10"
                        >
                            <HiXMark className="w-4 h-4 text-primary-500" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2 pointer-events-none">
                        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HiCloudArrowUp className="w-6 h-6 text-secondary-500" />
                        </div>
                        <h3 className="text-lg font-bold text-secondary-900">Upload Video File</h3>
                        <p className="text-secondary-500">Drag and drop your video file here, or click to browse</p>
                        <p className="text-xs text-secondary-400 mt-2">MP4, MOV, or WebM (Max 500MB)</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Select Course <span className="text-red-500">*</span></label>
                        <select
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        >
                            <option value="">-- Choose a Course --</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                        <p className="text-xs text-secondary-500 mt-1">Video will be added to this course.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to UI Design"
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Description <span className="text-red-500">*</span></label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe what students will learn..."
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Tags</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="e.g. design, beginner, theory (comma separated)"
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                </div>

                {/* Right Column: Settings & Price */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g. Design"
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Price per Minute ($) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500">$</span>
                            <input
                                type="number"
                                name="pricePerMinute"
                                value={formData.pricePerMinute}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full pl-7 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <p className="text-xs text-secondary-500 mt-1">Students pay based on watch time.</p>
                    </div>

                    <div className="pt-4 border-t border-secondary-200">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Thumbnail</label>
                        <div className="border border-dashed border-secondary-300 rounded-lg p-4 hover:bg-secondary-50 transition-colors text-center cursor-pointer">
                            <input
                                type="file"
                                name="thumbnailFile"
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                                id="thumbnail-upload"
                            />
                            <label htmlFor="thumbnail-upload" className="cursor-pointer block">
                                <span className="text-secondary-600 text-sm">Upload Image</span>
                            </label>
                        </div>
                        {formData.thumbnailFile && (
                            <p className="text-xs text-secondary-600 mt-1 truncate">{formData.thumbnailFile.name}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-secondary-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-secondary-300 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transform hover:-translate-y-0.5 transition-all ${loading ? 'opacity-70 cursor-not-allowed transform-none' : ''
                        }`}
                >
                    {loading ? 'Uploading...' : 'Publish Video'}
                </button>
            </div>
        </form>
    );
}
