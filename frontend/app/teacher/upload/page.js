'use client';

import TeacherLayout from '@/components/Layout/TeacherLayout';
import VideoUploadForm from '@/components/Teacher/VideoUploadForm';

export default function UploadPage() {
    return (
        <TeacherLayout activeTab="upload">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-secondary-900 mb-2">Upload Content</h1>
                    <p className="text-secondary-600">Share your knowledge and start earning.</p>
                </div>

                <VideoUploadForm />
            </div>
        </TeacherLayout>
    );
}
