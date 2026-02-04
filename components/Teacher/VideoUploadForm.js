'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiCloudArrowUp, HiX } from 'react-icons/hi2';

export default function VideoUploadForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pricePerMinute: '',
        category: '',
        tags: '',
        videoFile: null,
        thumbnailFile: null
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate upload
        setTimeout(() => {
            setLoading(false);
            router.push('/teacher/videos');
        }, 2000);
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
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mb-3">
                            <HiCloudArrowUp className="w-8 h-8" />
                        </div>
                        <p className="font-medium text-success-700">{formData.videoFile.name}</p>
                        <p className="text-sm text-secondary-500">{(formData.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFormData({ ...formData, videoFile: null }) }}
                            className="mt-4 text-sm text-error-600 hover:underline z-10 relative"
                        >
                            Remove file
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                            <HiCloudArrowUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-medium text-secondary-900 mb-1">Drag & Drop Video Here</h3>
                        <p className="text-secondary-500 mb-4">or click to browse files</p>
                        <p className="text-xs text-secondary-400">MP4, WebM up to 2GB</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Introduction to React Hooks"
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="What will students learn in this video?"
                            rows="5"
                            className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="web-dev">Web Development</option>
                                <option value="data-science">Data Science</option>
                                <option value="design">Design</option>
                                <option value="business">Business</option>
                            </select>
                        </div>

                        {/* <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">Tags</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="react, coding, web (comma separated)"
                                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>*/}
                    </div>
                </div>

                {/* Right Column: Pricing & Thumbnail */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-secondary-200">
                        <h3 className="font-medium text-secondary-900 mb-4">Pricing</h3>

                        <label className="block text-xs font-medium text-secondary-700 mb-1">Price per Minute (₹)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-secondary-500">₹</span>
                            <input
                                type="number"
                                name="pricePerMinute"
                                value={formData.pricePerMinute}
                                onChange={handleChange}
                                placeholder="e.g. 5"
                                className="w-full pl-8 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                required
                                min="1"
                            />
                        </div>
                        <p className="text-xs text-secondary-500 mt-2">
                            Students will be charged this amount for every minute they watch.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-secondary-200">
                        <h3 className="font-medium text-secondary-900 mb-4">Thumbnail</h3>
                        <div className="border border-dashed border-secondary-300 rounded-lg p-4 text-center">
                            <input
                                type="file"
                                name="thumbnailFile"
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                                id="thumbnail-upload"
                            />
                            <label htmlFor="thumbnail-upload" className="cursor-pointer">
                                {formData.thumbnailFile ? (
                                    <div className="text-success-600 text-sm font-medium truncate">
                                        {formData.thumbnailFile.name}
                                    </div>
                                ) : (
                                    <span className="text-primary-600 text-sm font-medium hover:underline">
                                        Upload Image
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-secondary-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 text-secondary-600 font-medium hover:bg-secondary-50 rounded-lg mr-4 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !formData.videoFile}
                    className={`px-8 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-sm transition-all ${loading || !formData.videoFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700 hover:shadow'
                        }`}
                >
                    {loading ? 'Uploading...' : 'Publish Video'}
                </button>
            </div>
        </form>
    );
}
