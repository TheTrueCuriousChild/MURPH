export const courses = [
    {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        instructor: 'Dr. Angela Yu',
        thumbnail: 'https://via.placeholder.com/300x200/667EEA/FFFFFF?text=Web+Dev',
        progress: 45,
        costPerMinute: 2.5,
        duration: 120,
        category: 'Development',
        rating: 4.8,
        enrolled: true,
        completed: false,
    },
    {
        id: '2',
        title: 'Machine Learning A-Z',
        instructor: 'Kirill Eremenko',
        thumbnail: 'https://via.placeholder.com/300x200/764BA2/FFFFFF?text=ML+Course',
        progress: 78,
        costPerMinute: 3.0,
        duration: 180,
        category: 'Data Science',
        rating: 4.9,
        enrolled: true,
        completed: false,
    },
    {
        id: '3',
        title: 'React Native - The Practical Guide',
        instructor: 'Maximilian Schwarzmüller',
        thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=React+Native',
        progress: 100,
        costPerMinute: 2.8,
        duration: 150,
        category: 'Mobile Development',
        rating: 4.7,
        enrolled: true,
        completed: true,
    },
    {
        id: '4',
        title: 'Advanced JavaScript Concepts',
        instructor: 'Andrei Neagoie',
        thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=JavaScript',
        progress: 23,
        costPerMinute: 2.2,
        duration: 90,
        category: 'Programming',
        rating: 4.8,
        enrolled: true,
        completed: false,
    },
    {
        id: '5',
        title: 'Python for Data Science',
        instructor: 'Jose Portilla',
        thumbnail: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Python+DS',
        progress: 0,
        costPerMinute: 2.6,
        duration: 110,
        category: 'Data Science',
        rating: 4.6,
        enrolled: false,
        completed: false,
    },
    {
        id: '6',
        title: 'UI/UX Design Masterclass',
        instructor: 'Daniel Schifano',
        thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=UI+UX',
        progress: 0,
        costPerMinute: 2.0,
        duration: 100,
        category: 'Design',
        rating: 4.9,
        enrolled: false,
        completed: false,
    },
];

export const transactions = [
    {
        id: '1',
        type: 'credit',
        description: 'Added funds via Credit Card',
        amount: 500,
        date: '2026-02-03T10:30:00',
        status: 'completed',
    },
    {
        id: '2',
        type: 'debit',
        description: 'Web Development Course - 30 min',
        amount: -75,
        date: '2026-02-02T15:45:00',
        status: 'completed',
    },
    {
        id: '3',
        type: 'locked',
        description: 'Machine Learning Course - Enrolled',
        amount: -540,
        date: '2026-02-01T09:15:00',
        status: 'locked',
    },
    {
        id: '4',
        type: 'credit',
        description: 'Refund - Cancelled Course',
        amount: 200,
        date: '2026-01-31T14:20:00',
        status: 'completed',
    },
    {
        id: '5',
        type: 'debit',
        description: 'React Native Course - 45 min',
        amount: -126,
        date: '2026-01-30T11:00:00',
        status: 'completed',
    },
    {
        id: '6',
        type: 'locked',
        description: 'JavaScript Course - Enrolled',
        amount: -198,
        date: '2026-01-29T16:30:00',
        status: 'locked',
    },
    {
        id: '7',
        type: 'credit',
        description: 'Added funds via Debit Card',
        amount: 1000,
        date: '2026-01-28T10:00:00',
        status: 'completed',
    },
];

export const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student',
    avatar: 'https://via.placeholder.com/100/6366F1/FFFFFF?text=JD',
    totalBalance: 1461,
    availableBalance: 723,
    lockedAmount: 738,
    enrolledCourses: 4,
    completedCourses: 1,
    inProgressCourses: 3,
};

export const chatHistory = [
    {
        id: '1',
        sender: 'ai',
        message: 'Hello! I\'m your learning assistant. I can help you find the perfect courses based on your interests and learning goals. What would you like to learn today?',
        timestamp: '2026-02-04T10:00:00',
    },
];

export const teacherStats = {
    totalEarnings: 12500,
    totalViews: 45000,
    totalVideos: 12,
    avgRating: 4.8,
};

export const teacherVideos = [
    {
        id: '101',
        title: 'Introduction to React Native Navigation',
        thumbnail: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=RN+Navigation',
        views: 1250,
        rating: 4.9,
        uploadDate: '2026-01-15',
        duration: 45,
        pricePerMinute: 5.0,
        status: 'published',
    },
    {
        id: '102',
        title: 'Mastering State Management with Redux',
        thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Redux+Mastery',
        views: 980,
        rating: 4.7,
        uploadDate: '2026-01-28',
        duration: 60,
        pricePerMinute: 6.5,
        status: 'published',
    },
    {
        id: '103',
        title: 'Building Responsive Layouts',
        thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Responsive+UI',
        views: 450,
        rating: 4.5,
        uploadDate: '2026-02-02',
        duration: 35,
        pricePerMinute: 4.0,
        status: 'processing',
    },
];

export const teacherTransactions = [
    {
        id: 't1',
        type: 'credit',
        description: 'Monthly Earnings - January',
        amount: 4500,
        date: '2026-02-01T09:00:00',
        status: 'completed',
    },
    {
        id: 't2',
        type: 'debit',
        description: 'Withdrawal to Bank Account ****1234',
        amount: -2000,
        date: '2026-01-25T14:30:00',
        status: 'completed',
    },
    {
        id: 't3',
        type: 'credit',
        description: 'Course Sales - "RN Navigation"',
        amount: 850,
        date: '2026-01-20T18:45:00',
        status: 'completed',
    },
];

export const teacherProfile = {
    name: 'Sarah Teacher',
    email: 'sarah.teacher@example.com',
    role: 'teacher',
    avatar: 'https://via.placeholder.com/100/F59E0B/FFFFFF?text=ST',
    totalEarnings: 12500,
};

export const qaData = [
    {
        id: 'q1',
        user: 'Alice M.',
        question: 'Can you explain the difference between useEffect and useLayoutEffect?',
        answers: [
            {
                id: 'a1',
                user: 'Instructor',
                text: 'useEffect runs asynchronously after render, while useLayoutEffect runs synchronously before the browser paints.',
                timestamp: '2026-02-03T11:00:00',
            }
        ],
        timestamp: '2026-02-03T10:00:00',
    },
    {
        id: 'q2',
        user: 'Bob D.',
        question: 'How do I pass props between screens in React Navigation?',
        answers: [],
        timestamp: '2026-02-04T09:30:00',
    },
];

export const reviewsData = [
    {
        id: 'r1',
        user: 'Charlie K.',
        rating: 5,
        comment: 'Excellent explanation! The examples were very clear.',
        date: '2026-01-20',
    },
    {
        id: 'r2',
        user: 'Dana S.',
        rating: 4,
        comment: 'Good content, but the audio volume was a bit low.',
        date: '2026-01-22',
    },
    {
        id: 'r3',
        user: 'Evan R.',
        rating: 5,
        comment: 'Best course on React Native so far. Highly recommended!',
        date: '2026-01-25',
    },
];
