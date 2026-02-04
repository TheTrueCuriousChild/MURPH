import React, { useState } from 'react';
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

const MyCoursesScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');

    const enrolledCourses = filterCourses(courses, 'enrolled');
    const inProgressCourses = filterCourses(courses, 'in-progress');
    const completedCourses = filterCourses(courses, 'completed');

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
                            onPress={() => navigation.navigate('VideoPlayer', {
                                videoParams: {
                                    title: course.title,
                                    source: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
                                }
                            })}
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
