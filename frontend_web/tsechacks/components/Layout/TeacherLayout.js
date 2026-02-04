import TeacherSidebar from './TeacherSidebar';
import Header from './Header';

export default function TeacherLayout({ children, activeTab }) {
    return (
        <div className="flex h-screen bg-secondary-50">
            <TeacherSidebar activeTab={activeTab} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
