'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HiHome, HiBookOpen, HiWallet, HiClock, HiChevronLeft, HiChevronRight, HiArrowRightOnRectangle } from 'react-icons/hi2';
import { IoSparkles } from 'react-icons/io5';

export default function Sidebar({ activeTab }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HiHome, href: '/dashboard' },
        { id: 'courses', label: 'My Courses', icon: HiBookOpen, href: '/courses' },
        { id: 'chatbot', label: 'AI Assistant', icon: IoSparkles, href: '/chatbot' },
        { id: 'wallet', label: 'Wallet', icon: HiWallet, href: '/wallet' },
        { id: 'history', label: 'History', icon: HiClock, href: '/history' },
    ];

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-secondary-200 min-h-screen transition-all duration-300 flex flex-col`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-secondary-200">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <h1 className="text-2xl font-bold text-primary-600">EduPortal</h1>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-secondary-400 hover:text-secondary-600 transition-colors p-1"
                    >
                        {isCollapsed ? <HiChevronRight className="w-5 h-5" /> : <HiChevronLeft className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${activeTab === item.id
                                            ? 'bg-primary-50 text-primary-700 font-medium'
                                            : 'text-secondary-600 hover:bg-secondary-50'
                                        }
                  `}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-secondary-200">
                <button
                    onClick={() => {
                        localStorage.removeItem('userRole');
                        localStorage.removeItem('isAuthenticated');
                        window.location.href = '/login';
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-error-600 hover:bg-error-50 transition-all w-full ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-secondary-200">
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                        JD
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900">John Doe</p>
                            <p className="text-xs text-secondary-500">john@example.com</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
