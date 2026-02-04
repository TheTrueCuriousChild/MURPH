import Link from 'next/link';

export default function SessionRecommendation({ recommendation }) {
    return (
        <Link href={`/session/${recommendation.sessionId}`}>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 hover:border-primary-400 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📹</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900 mb-1">{recommendation.title}</h4>
                        <p className="text-sm text-secondary-600 mb-2">{recommendation.courseName}</p>
                        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Start Session →
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
