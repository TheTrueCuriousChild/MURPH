'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HiArrowLeft, HiVideoCamera, HiClock, HiCurrencyDollar, HiCheckCircle, HiXMark, HiPlay } from 'react-icons/hi2';
import { API_URL } from '@/lib/config';
import VideoUploadForm from '@/components/Teacher/VideoUploadForm';

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { courseId } = params;

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('lectures');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [modalTab, setModalTab] = useState('overview'); // 'overview', 'qa', 'reviews'
    const [streamUrl, setStreamUrl] = useState(null); // New state for video stream URL

    const handlePlayVideo = (lecture) => {
        // Direct preview using the cookie for authentication
        // Note: This relies on the browser sending the 'accessToken' cookie automatically.
        // If cookies are not working, we might need to append ?token={token} to the URL
        // but let's try standard cookie auth first as per authMiddleware.
        const previewUrl = `${API_URL}/teacher/lectures/${lecture.id}/preview`;
        setStreamUrl(previewUrl);
        setSelectedLecture(lecture);
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`${API_URL}/teacher/courses/${courseId}`, {
                    headers: headers
                });
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    setCourse(data.data);
                } else {
                    alert(data.message || 'Failed to fetch course details');
                    router.push('/teacher/my-courses');
                }
            } catch (error) {
                console.error('Fetch course error:', error);
                alert('Error fetching course details');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseDetails();
        }
    }, [courseId, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <button
                onClick={() => router.push('/teacher/my-courses')}
                className="flex items-center text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
            >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                Back to Courses
            </button>

            {/* Course Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 p-8 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900 mb-2">{course.title}</h1>
                        <p className="text-secondary-600 mb-4 max-w-2xl">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm text-secondary-500">
                            <span className="flex items-center gap-1">
                                <HiVideoCamera className="w-5 h-5 text-primary-500" />
                                {course.lectures ? course.lectures.length : 0} Lectures
                            </span>
                            <span className="flex items-center gap-1">
                                <HiClock className="w-5 h-5 text-primary-500" />
                                Updated Recently
                            </span>
                        </div>
                    </div>
                    <div className="bg-primary-50 px-4 py-2 rounded-lg">
                        <span className="text-primary-700 font-bold text-sm">Published</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b border-secondary-200">
                <button
                    onClick={() => setActiveTab('lectures')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'lectures'
                        ? 'text-primary-600'
                        : 'text-secondary-500 hover:text-secondary-700'
                        }`}
                >
                    Lectures
                    {activeTab === 'lectures' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'upload'
                        ? 'text-primary-600'
                        : 'text-secondary-500 hover:text-secondary-700'
                        }`}
                >
                    Upload New Lecture
                    {activeTab === 'upload' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Content */}
            {activeTab === 'lectures' ? (
                <div className="space-y-4">
                    {course.lectures && course.lectures.length > 0 ? (
                        course.lectures.map((lecture) => (
                            <div
                                key={lecture.id}
                                onClick={() => setSelectedLecture(lecture)}
                                className="bg-white p-6 rounded-xl border border-secondary-100 flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HiVideoCamera className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-secondary-900">{lecture.title}</h3>
                                        <p className="text-secondary-500 text-sm mb-2 line-clamp-1">{lecture.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-secondary-400">
                                            <span className="flex items-center gap-1 bg-secondary-50 px-2 py-1 rounded">
                                                <HiCurrencyDollar className="w-3 h-3" />
                                                ₹{lecture.pricePerMinute}/min
                                            </span>
                                            <span className="bg-secondary-50 px-2 py-1 rounded">
                                                {lecture.category || 'General'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center gap-1">
                                        <HiCheckCircle className="w-3 h-3" /> Active
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-secondary-200">
                            <p className="text-secondary-500">No lectures uploaded yet.</p>
                            <button
                                onClick={() => setActiveTab('upload')}
                                className="text-primary-600 font-medium hover:underline mt-2"
                            >
                                Upload your first lecture
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-8">
                    <h2 className="text-xl font-bold text-secondary-900 mb-6">Upload New Lecture</h2>
                    <VideoUploadForm preSelectedCourseId={courseId} />
                </div>
            )}
            {/* Video Preview Modal */}
            {selectedLecture && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl">
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setSelectedLecture(null)}
                                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                            >
                                <HiXMark className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <video
                                src={selectedLecture.videoUrl}
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            >
                                <p>Your browser does not support the video tag.</p>
                            </video>
                        </div>
                        <div className="p-0">
                            {/* Modal Tabs */}
                            <div className="flex border-b border-gray-800 bg-gray-900">
                                {['overview', 'qa', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            // Local state for modal tabs would be ideal, but for now we can just toggle content
                                            // Since we don't have a separate state for modal tab, let's add one quickly or reuse
                                            // Actually, I need to add state for this modal's active tab.
                                            // Let's use a new state variable inside the map or component.
                                            // Since I can't easily add state in this replace block properly without modifying the whole component,
                                            // I will render ALL sections for now, or use a simple toggle if I can't add state.
                                            // BETTER APPROACH: Add 'modalTab' state to the component.
                                        }}
                                        className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                                            // Placeholder for active state check
                                            'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {tab === 'qa' ? 'Q&A' : tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content Placeholder - I need to update the component to support this state first */}
                            <div className="p-6 bg-white min-h-[200px]">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedLecture.title}</h3>
                                <p className="text-gray-600 mb-6">{selectedLecture.description}</p>

                                {/* Mock Q&A for Web */}
                                <div className="mt-6 border-t pt-6">
                                    <h4 className="font-bold text-gray-900 mb-4">Q&A (Mock)</h4>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="font-medium text-gray-900">John Doe <span className="text-gray-500 font-normal text-xs ml-2">2h ago</span></p>
                                            <p className="text-gray-700 mt-1">Can you explain the last part again?</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
