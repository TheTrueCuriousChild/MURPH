'use client';

export default function VideoPlayer({ videoUrl, onPlay, onPause }) {
    return (
        <div className="bg-secondary-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {/* Placeholder - Replace with actual video player */}
            <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-white text-lg mb-4">Video Player</p>
                <p className="text-secondary-400 text-sm">{videoUrl || 'No video URL'}</p>

                {/* Demo Controls */}
                <div className="mt-6 flex gap-4 justify-center">
                    <button
                        onClick={onPlay}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                        <span>▶</span> Play
                    </button>
                    <button
                        onClick={onPause}
                        className="px-6 py-3 bg-secondary-700 text-white rounded-lg hover:bg-secondary-600 transition-colors flex items-center gap-2"
                    >
                        <span>⏸</span> Pause
                    </button>
                </div>
            </div>
        </div>
    );
}
