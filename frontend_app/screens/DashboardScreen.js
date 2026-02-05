import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { getGreeting, formatCurrency, filterCourses } from '../utils/helpers';
import BalanceCard from '../components/BalanceCard';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import { API_URL } from '../constants/config';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.70;

const DashboardScreen = ({ navigation }) => {
    const { user, token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_URL}/user/courses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setCourses(data.data.map(c => ({
                        ...c,
                        instructor: c.teacher?.username || 'Instructor',
                        totalSessions: c._count?.lectures || 0,
                        thumbnail: 'https://via.placeholder.com/150', // Placeholder for now
                        rating: 4.5,
                        progress: 0
                    })));
                }
            } catch (error) {
                console.error('Fetch courses error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchCourses();
    }, [token]);

    const continueWatchingCourses = []; // Placeholder until session history is implemented
    const exploreCourses = courses;

    const handleSearch = (searchText) => {
        console.log('Searching for:', searchText);
    };

    return (
        <View style={styles.container}>
            {/* Header with Search */}
            <View style={styles.header}>
                <SearchBar onSearch={handleSearch} />
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color={colors.text} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.greeting}>{getGreeting()},</Text>
                    <Text style={styles.userName}>{user?.name || 'Student'}!</Text>
                </View>

                {/* Balance Cards */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.balanceCardsContainer}
                >
                    <BalanceCard
                        icon="wallet"
                        label="Available Balance"
                        value={formatCurrency(user?.availableBalance || 0)}
                        color={colors.success}
                    />
                    <BalanceCard
                        icon="lock-closed"
                        label="Locked Amount"
                        value={formatCurrency(user?.lockedAmount || 0)}
                        color={colors.warning}
                    />
                    <BalanceCard
                        icon="book"
                        label="Enrolled Courses"
                        value={user?.enrolledCourses || 0}
                        color={colors.primary}
                    />
                </ScrollView>

                {/* Continue Watching */}
                {continueWatchingCourses.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Continue Watching</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {continueWatchingCourses.map((course) => (
                                <View key={course.id} style={styles.horizontalCard}>
                                    <CourseCard
                                        course={course}
                                        onPress={() => navigation.navigate('StudentCourseDetails', { courseId: course.id })}
                                        showProgress={true}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Explore Courses */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Explore Courses</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {exploreCourses.slice(0, 3).map((course) =>
                        <CourseCard
                            key={course.id}
                            course={course}
                            onPress={() => navigation.navigate('StudentCourseDetails', { courseId: course.id })}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        paddingTop: spacing.xl,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacing.sm,
    },
    iconButton: {
        position: 'relative',
        marginLeft: spacing.sm,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
    },
    content: {
        flex: 1,
    },
    welcomeSection: {
        padding: spacing.lg,
    },
    greeting: {
        ...typography.body1,
        color: colors.textLight,
    },
    userName: {
        ...typography.h1,
        marginTop: spacing.xs,
    },
    balanceCardsContainer: {
        paddingLeft: spacing.md,
        marginBottom: spacing.lg,
        paddingBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
    },
    seeAll: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
    },
    horizontalCard: {
        width: CARD_WIDTH,
        marginRight: spacing.md,
    },
});

export default DashboardScreen;
