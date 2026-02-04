'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/lib/hooks';
import { HiMagnifyingGlass, HiBell, HiUserCircle, HiWallet, HiArrowRightOnRectangle } from 'react-icons/hi2';

export default function Header() {
    const { balance, loading } = useWallet();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState({ name: 'User', role: 'Student' });

    useEffect(() => {
        const role = localStorage.getItem('userRole') || 'student';
        setUser({
            name: role === 'teacher' ? 'Disha Shah' : 'Tanay Prajapati',
            role: role
        });
    }, []);

    return (
        <header className="bg-white border-b border-secondary-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search courses, sessions..."
                            className="w-full px-4 py-2 pl-10 bg-secondary-50 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <HiMagnifyingGlass className="absolute left-3 top-2.5 w-5 h-5 text-secondary-400" />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-6 ml-6">
                    {/* Wallet Balance */}
                    {/*<div className="flex items-center gap-2 px-4 py-2 bg-success-50 rounded-lg">
                        <HiWallet className="w-5 h-5 text-success-600" />
                        <span className="font-semibold text-success-700">
                            {loading ? '...' : `$${balance.toFixed(2)}`}
                        </span>
                    </div>*/}

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
                        >
                            <HiBell className="w-6 h-6" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full"></span>
                        </button>
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                        >
                            <HiUserCircle className="w-8 h-8 text-primary-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {showProfile && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                                <div className="px-4 py-2 border-b border-secondary-200">
                                    <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                                    <p className="text-xs text-secondary-500 capitalize">{user.role}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('userRole');
                                        localStorage.removeItem('isAuthenticated');
                                        window.location.href = '/login';
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                                >
                                    <HiArrowRightOnRectangle className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
