import Card from '../UI/Card';
import Link from 'next/link';
import { FaStar, FaBook, FaCheckCircle } from 'react-icons/fa';

export default function CourseCard({ course, showProgress = false }) {
    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-secondary-300'}`} />
                ))}
            </div>
        );
    };

    return (
        <Link href={`/course/${course.id}`}>
            <Card hover className="overflow-hidden cursor-pointer">
                {/* Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <FaBook className="text-6xl text-primary-600" />
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Category */}
                    <span className="inline-block px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded mb-2">
                        {course.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1 line-clamp-2">
                        {course.title}
                    </h3>

                    {/* Instructor */}
                    <p className="text-sm text-secondary-600 mb-3">{course.instructor}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-1">
                            {renderStars(course.rating)}
                            <span className="font-medium ml-1">{course.rating}</span>
                        </div>
                        <span className="text-secondary-500">{course.totalSessions} sessions</span>
                    </div>

                    {/* Progress Bar (if enrolled) */}
                    {showProgress && course.enrolled && (
                        <div className="mb-3">
                            <div className="flex justify-between text-xs text-secondary-600 mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-secondary-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
                        <div>
                            <p className="text-xs text-secondary-500">Per minute</p>
                            <p className="text-lg font-bold text-primary-600">₹{course.pricePerMinute}</p>
                        </div>
                        {course.enrolled ? (
                            <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-success-700 bg-success-50 rounded-full">
                                <FaCheckCircle className="w-3 h-3" /> Enrolled
                            </span>
                        ) : (
                            <span className="px-3 py-1 text-xs font-medium text-secondary-700 bg-secondary-100 rounded-full">
                                {course.totalSessions} sessions
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
