import Card from '../UI/Card';
import Link from 'next/link';
import { HiPlay, HiStar, HiEye, HiCurrencyRupee } from 'react-icons/hi2';

export default function VideoCard({ video }) {
    return (
        <Link href={`/teacher/videos/${video.id}`}>
            <Card hover className="overflow-hidden cursor-pointer h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative h-40 bg-gray-200">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x225?text=Video+Thumbnail';
                        }}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <HiPlay className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                        {video.title}
                    </h3>

                    <div className="mt-auto space-y-3">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-1.5 text-secondary-600">
                                <HiEye className="w-4 h-4" />
                                <span>{video.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-secondary-600">
                                <HiStar className="w-4 h-4 text-warning-500" />
                                <span>{video.rating}</span>
                            </div>
                        </div>

                        {/* Earnings */}
                        <div className="pt-3 border-t border-secondary-100 flex items-center justify-between">
                            <span className="text-xs text-secondary-500">Earnings</span>
                            <div className="flex items-center gap-1 font-bold text-success-600">
                                <HiCurrencyRupee className="w-4 h-4" />
                                <span>{video.earnings.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
