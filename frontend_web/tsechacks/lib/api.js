// API utility with automatic fallback to static data
// This implements the || pattern for API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Mock data for fallback
export const MOCK_DATA = {
    user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        walletBalance: 5000.00, // INR
        avatar: '/avatar-placeholder.jpg',
    },

    courses: [
        {
            id: 1,
            title: 'Advanced React Patterns',
            instructor: 'Sarah Johnson',
            thumbnail: '/course-1.jpg',
            price: 1999, // Total course price in INR
            pricePerMinute: 5, // INR per minute
            rating: 4.8,
            totalSessions: 24,
            totalDuration: 720, // Total minutes
            category: 'Web Development',
            description: 'Master advanced React patterns and best practices for scalable applications.',
            enrolled: true,
            progress: 45,
        },
        {
            id: 2,
            title: 'Python for Data Science',
            instructor: 'Dr. Michael Chen',
            thumbnail: '/course-2.jpg',
            price: 2499, // INR
            pricePerMinute: 6, // INR per minute
            rating: 4.9,
            totalSessions: 30,
            totalDuration: 900, // Total minutes
            category: 'Data Science',
            description: 'Complete guide to Python programming for data analysis and machine learning.',
            enrolled: true,
            progress: 20,
        },
        {
            id: 3,
            title: 'UI/UX Design Fundamentals',
            instructor: 'Emily Rodriguez',
            thumbnail: '/course-3.jpg',
            price: 1499, // INR
            pricePerMinute: 4, // INR per minute
            rating: 4.7,
            totalSessions: 18,
            totalDuration: 540, // Total minutes
            category: 'Design',
            description: 'Learn the principles of user interface and user experience design.',
            enrolled: false,
            progress: 0,
        },
        {
            id: 4,
            title: 'Machine Learning Basics',
            instructor: 'Prof. James Wilson',
            thumbnail: '/course-4.jpg',
            price: 2999, // INR
            pricePerMinute: 8, // INR per minute
            rating: 4.6,
            totalSessions: 25,
            totalDuration: 750, // Total minutes
            category: 'AI & ML',
            description: 'Introduction to machine learning algorithms and practical applications.',
            enrolled: false,
            progress: 0,
        },
    ],

    sessions: [
        {
            id: 1,
            courseId: 1,
            title: 'Introduction to React Hooks',
            description: 'Learn the fundamentals of React Hooks and how to use them effectively.',
            duration: 45, // minutes
            pricePerMinute: 5, // INR per minute
            videoUrl: '/videos/session-1.mp4',
            completed: false,
        },
        {
            id: 2,
            courseId: 1,
            title: 'Advanced State Management',
            description: 'Deep dive into state management patterns using hooks.',
            duration: 60, // minutes
            pricePerMinute: 5, // INR per minute
            videoUrl: '/videos/session-2.mp4',
            completed: false,
        },
    ],

    continueWatching: [
        {
            sessionId: 1,
            courseId: 1,
            courseTitle: 'Advanced React Patterns',
            sessionTitle: 'Introduction to React Hooks',
            progress: 65,
            lastWatched: '2 hours ago',
            duration: 45, // minutes
            watchedMinutes: 29, // minutes watched so far
            pricePerMinute: 5, // INR per minute
        },
        {
            sessionId: 2,
            courseId: 2,
            courseTitle: 'Python for Data Science',
            sessionTitle: 'Pandas DataFrames Basics',
            progress: 30,
            lastWatched: '1 day ago',
            duration: 50, // minutes
            watchedMinutes: 15,
            pricePerMinute: 6, // INR per minute
        },
    ],

    wallet: {
        balance: 5000.00, // INR
        lockedAmount: 150.00, // INR
        transactions: [
            {
                id: 1,
                type: 'credit',
                amount: 2000,
                description: 'Added funds',
                date: '2024-01-15 10:30 AM',
                status: 'completed',
            },
            {
                id: 2,
                type: 'debit',
                amount: 150,
                description: 'Session: Introduction to React Hooks (30 min @ ₹5/min)',
                date: '2024-01-14 3:45 PM',
                status: 'completed',
            },
            {
                id: 3,
                type: 'locked',
                amount: 150,
                description: 'Locked for active session',
                date: '2024-01-15 11:00 AM',
                status: 'pending',
            },
            {
                id: 4,
                type: 'credit',
                amount: 3000,
                description: 'Added funds',
                date: '2024-01-10 2:20 PM',
                status: 'completed',
            },
            {
                id: 5,
                type: 'debit',
                amount: 180,
                description: 'Session: Pandas DataFrames (30 min @ ₹6/min)',
                date: '2024-01-12 5:15 PM',
                status: 'completed',
            },
        ],
    },

    chatHistory: [
        {
            id: 'msg-1',
            role: 'user',
            content: 'I want to learn React hooks',
            timestamp: '2026-02-04T09:30:00',
        },
        {
            id: 'msg-2',
            role: 'assistant',
            content: 'Great choice! Based on your interests, I recommend starting with "Advanced React Patterns" course. It has excellent coverage of hooks and modern React practices.',
            timestamp: '2026-02-04T09:30:05',
            recommendations: [
                {
                    sessionId: 1,
                    courseId: 1,
                    title: 'Introduction to React Hooks',
                    courseName: 'Advanced React Patterns',
                },
            ],
        },
    ],

    viewingHistory: [
        {
            id: 1,
            courseTitle: 'Advanced React Patterns',
            sessionTitle: 'Introduction to React Hooks',
            watchedAt: '2024-01-14',
            duration: 30, // minutes watched
            totalDuration: 45, // total session duration
            cost: 150, // 30 min × ₹5/min = ₹150
            pricePerMinute: 5,
            completed: false,
            progress: 67,
        },
        {
            id: 2,
            courseTitle: 'Python for Data Science',
            sessionTitle: 'Pandas DataFrames Basics',
            watchedAt: '2024-01-12',
            duration: 50, // minutes watched
            totalDuration: 50,
            cost: 300, // 50 min × ₹6/min = ₹300
            pricePerMinute: 6,
            completed: true,
            progress: 100,
        },
        {
            id: 3,
            courseTitle: 'Advanced React Patterns',
            sessionTitle: 'Custom Hooks Deep Dive',
            watchedAt: '2024-01-10',
            duration: 45,
            totalDuration: 45,
            cost: 225, // 45 min × ₹5/min = ₹225
            pricePerMinute: 5,
            completed: true,
            progress: 100,
        },
    ],
};

// API fetch wrapper with automatic fallback
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn(`API call failed for ${endpoint}, using fallback data:`, error.message);
        return null; // Return null so the || operator can provide fallback
    }
}

// API endpoints with fallback pattern
export const api = {
    // User endpoints
    getUser: async () => await fetchAPI('/user') || MOCK_DATA.user,

    // Course endpoints
    getCourses: async () => await fetchAPI('/courses') || MOCK_DATA.courses,
    getCourse: async (id) => await fetchAPI(`/courses/${id}`) || MOCK_DATA.courses.find(c => c.id === parseInt(id)),
    getEnrolledCourses: async () => await fetchAPI('/courses/enrolled') || MOCK_DATA.courses.filter(c => c.enrolled),

    // Session endpoints
    getSession: async (id) => await fetchAPI(`/sessions/${id}`) || MOCK_DATA.sessions.find(s => s.id === parseInt(id)),
    getContinueWatching: async () => await fetchAPI('/sessions/continue') || MOCK_DATA.continueWatching,
    startSession: async (sessionId, pricePerMinute) => await fetchAPI(`/sessions/${sessionId}/start`, { method: 'POST' }) || { success: true, pricePerMinute: pricePerMinute || 5 },
    finishSession: async (sessionId, minutesWatched, pricePerMinute) => await fetchAPI(`/sessions/${sessionId}/finish`, { method: 'POST', body: JSON.stringify({ minutesWatched, pricePerMinute }) }) || { success: true, amountCharged: minutesWatched * pricePerMinute },

    // Wallet endpoints
    getWallet: async () => await fetchAPI('/wallet') || MOCK_DATA.wallet,
    addFunds: async (amount) => await fetchAPI('/wallet/add', { method: 'POST', body: JSON.stringify({ amount }) }) || { success: true, newBalance: MOCK_DATA.wallet.balance + amount },
    getTransactions: async () => await fetchAPI('/wallet/transactions') || MOCK_DATA.wallet.transactions,

    // Chatbot endpoints
    getChatHistory: async () => await fetchAPI('/chat/history') || MOCK_DATA.chatHistory,
    sendMessage: async (message) => await fetchAPI('/chat/message', { method: 'POST', body: JSON.stringify({ message }) }) || {
        role: 'assistant',
        content: 'This is a demo response. Connect the backend to get AI-powered recommendations!',
        recommendations: [],
    },

    // History endpoints
    getViewingHistory: async () => await fetchAPI('/history') || MOCK_DATA.viewingHistory,

    // Auth endpoints
    login: async (email, password) => await fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }) || {
        success: true,
        token: 'demo-token',
        user: MOCK_DATA.user,
    },
    // Teacher endpoints
    getTeacherProfile: async () => await fetchAPI('/teacher/profile') || MOCK_DATA.teacher,
    getTeacherVideos: async () => await fetchAPI('/teacher/videos') || MOCK_DATA.teacher.uploadedVideos,
    getTeacherEarnings: async () => await fetchAPI('/teacher/earnings') || {
        total: MOCK_DATA.teacher.totalEarnings,
        balance: MOCK_DATA.teacher.walletBalance,
        transactions: MOCK_DATA.teacher.transactions
    },
    uploadVideo: async (data) => await fetchAPI('/teacher/upload', { method: 'POST', body: JSON.stringify(data) }) || { success: true, id: Date.now() },
};

export default api;
