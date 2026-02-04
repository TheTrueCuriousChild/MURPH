'use client';

import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, activeTab = 'dashboard' }) {
    return (
        <div className="flex min-h-screen bg-secondary-50">
            <Sidebar activeTab={activeTab} />

            <div className="flex-1 flex flex-col">
                <Header />

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
