export const formatCurrency = (amount) => {
    return `₹${Math.abs(amount).toFixed(2)}`;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    return `${date.toLocaleDateString('en-US', dateOptions)} at ${date.toLocaleTimeString('en-US', timeOptions)}`;
};

export const calculateProgress = (watchedMinutes, totalMinutes) => {
    if (totalMinutes === 0) return 0;
    return Math.min((watchedMinutes / totalMinutes) * 100, 100);
};

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
};

export const filterCourses = (courses, filter) => {
    switch (filter) {
        case 'enrolled':
            return courses.filter(course => course.enrolled);
        case 'in-progress':
            return courses.filter(course => course.enrolled && !course.completed && course.progress > 0);
        case 'completed':
            return courses.filter(course => course.completed);
        case 'all':
        default:
            return courses;
    }
};

export const filterTransactions = (transactions, filter) => {
    if (filter === 'all') return transactions;
    return transactions.filter(transaction => transaction.type === filter);
};
