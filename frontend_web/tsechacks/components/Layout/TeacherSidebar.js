'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiHome, HiVideoCamera, HiCloudArrowUp, HiWallet, HiChevronLeft, HiChevronRight, HiArrowRightOnRectangle, HiBookOpen } from 'react-icons/hi2';
import { IoSparkles } from 'react-icons/io5';

export default function TeacherSidebar({ activeTab }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HiHome, href: '/teacher/dashboard' },
        { id: 'courses', label: 'My Courses', icon: HiBookOpen, href: '/teacher/my-courses' },
        { id: 'videos', label: 'My Videos', icon: HiVideoCamera, href: '/teacher/videos' },
        { id: 'upload', label: 'Upload Content', icon: HiCloudArrowUp, href: '/teacher/upload' },
        { id: 'wallet', label: 'Wallet', icon: HiWallet, href: '/teacher/wallet' },
        { id: 'assistant', label: 'AI Assistant', icon: IoSparkles, href: '/teacher/assistant' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('isAuthenticated');
        router.push('/login');
    };

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-secondary-200 transition-all duration-300 flex flex-col`}>
            {/* Logo */}
            <div className="p-6 border-b border-secondary-200">
                <h1 className={`font-bold ${isCollapsed ? 'text-lg text-center' : 'text-2xl'} text-primary-600 transition-all`}>
                    {isCollapsed ? 'EP' : 'EduPortal'}
                </h1>
                {!isCollapsed && <p className="text-xs text-secondary-500 mt-1">Teacher Dashboard</p>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <Link key={item.id} href={item.href}>
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-secondary-600 hover:bg-secondary-50'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
                                {!isCollapsed && (
                                    <span className={`font-medium ${isActive ? 'text-primary-700' : ''}`}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-secondary-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-error-600 hover:bg-error-50 transition-all w-full"
                >
                    <HiArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-white border border-secondary-200 rounded-full p-1.5 hover:bg-secondary-50 transition-colors shadow-sm"
            >
                {isCollapsed ? (
                    <HiChevronRight className="w-4 h-4 text-secondary-600" />
                ) : (
                    <HiChevronLeft className="w-4 h-4 text-secondary-600" />
                )}
            </button>
        </aside>
    );
}
