'use client';

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, width = 'max-w-md' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative bg-white rounded-lg shadow-large ${width} w-full mx-4 max-h-[90vh] overflow-auto`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                    <h3 className="text-xl font-semibold text-secondary-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
