import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { courses } from '../constants/mockData';
import { colors, typography, spacing } from '../constants/theme';
import { filterCourses } from '../utils/helpers';
import BalanceCard from '../components/BalanceCard';
import CourseCard from '../components/CourseCard';

import { API_URL } from '../constants/config';

const MyCoursesScreen = ({ navigation }) => {
    const { user, token } = useAuth();
    const [filter, setFilter] = useState('all');
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
                        thumbnail: 'https://via.placeholder.com/150',
                        rating: 4.5,
                        progress: 0,
                        enrolled: true // Assume enrolled for now
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

    const enrolledCourses = courses;
    const inProgressCourses = []; // Placeholder
    const completedCourses = [];  // Placeholder

    const getFilteredCourses = () => {
        switch (filter) {
            case 'in-progress':
                return inProgressCourses;
            case 'completed':
                return completedCourses;
            default:
                return enrolledCourses;
        }
    };

    const FilterButton = ({ label, value }) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === value && styles.filterButtonActive]}
            onPress={() => setFilter(value)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    filter === value && styles.filterButtonTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <BalanceCard
                        icon="book-outline"
                        label="Total Courses"
                        value={enrolledCourses.length}
                        color={colors.primary}
                    />
                    <BalanceCard
                        icon="play-circle-outline"
                        label="In Progress"
                        value={inProgressCourses.length}
                        color={colors.warning}
                    />
                    <BalanceCard
                        icon="checkmark-circle-outline"
                        label="Completed"
                        value={completedCourses.length}
                        color={colors.success}
                    />
                </View>

                {/* Filter Buttons */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    <FilterButton label="All Courses" value="all" />
                    <FilterButton label="In Progress" value="in-progress" />
                    <FilterButton label="Completed" value="completed" />
                </ScrollView>

                {/* Courses List */}
                <View style={styles.coursesContainer}>
                    {getFilteredCourses().map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            showProgress={true}
                            onPress={() => navigation.navigate('StudentCourseDetails', { courseId: course.id })}
                        />
                    ))}
                    {getFilteredCourses().length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No courses found</Text>
                        </View>
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
        paddingTop: spacing.xxl,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    filtersContainer: {
        marginBottom: spacing.md,
    },
    filtersContent: {
        paddingHorizontal: spacing.md,
    },
    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterButtonText: {
        ...typography.body2,
        color: colors.text,
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: colors.textWhite,
    },
    coursesContainer: {
        padding: spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        ...typography.body1,
        color: colors.textLight,
    },
});

export default MyCoursesScreen;
