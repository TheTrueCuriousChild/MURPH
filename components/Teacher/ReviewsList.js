'use client';

import { HiStar, HiUserCircle } from 'react-icons/hi2';

export default function ReviewsList({ reviews }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-secondary-500 bg-secondary-50 rounded-lg">
                <p>No reviews yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="p-4 bg-white rounded-lg border border-secondary-200">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <HiUserCircle className="w-8 h-8 text-secondary-400" />
                            <div>
                                <p className="text-sm font-medium text-secondary-900">{review.studentName}</p>
                                <p className="text-xs text-secondary-500">{review.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-warning-50 px-2 py-1 rounded text-warning-700 text-sm font-medium">
                            <HiStar className="w-4 h-4 text-warning-500" />
                            <span>{review.rating}</span>
                        </div>
                    </div>
                    <p className="text-secondary-600 text-sm">{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
