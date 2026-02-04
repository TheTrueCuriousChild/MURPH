'use client';

export default function SessionTimer({ elapsedTime, isRunning, lockedAmount }) {
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-soft p-6 mb-4">
            <div className="flex items-center justify-between">
                {/* Timer Display */}
                <div className="flex items-center gap-6">
                    <div>
                        <p className="text-sm text-secondary-600 mb-1">Session Time</p>
                        <p className="text-3xl font-bold text-primary-600 font-mono">
                            {formatTime(elapsedTime)}
                        </p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-success-500 animate-pulse' : 'bg-secondary-300'}`} />
                        <span className="text-sm font-medium text-secondary-700">
                            {isRunning ? 'In Progress' : 'Paused'}
                        </span>
                    </div>
                </div>

                {/* Locked Amount */}
                <div className="text-right">
                    <p className="text-sm text-secondary-600 mb-1">Locked Amount</p>
                    <p className="text-2xl font-bold text-warning-600">${lockedAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}
