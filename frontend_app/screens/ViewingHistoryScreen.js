import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { courses } from '../constants/mockData';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { filterCourses } from '../utils/helpers';
import CourseCard from '../components/CourseCard';

const ViewingHistoryScreen = () => {
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

    const FilterChip = ({ icon, label, value, count, color }) => (
        <TouchableOpacity
            style={[
                styles.filterChip,
                filter === value && styles.filterChipActive,
                filter === value && { backgroundColor: color + '20', borderColor: color },
            ]}
            onPress={() => setFilter(value)}
        >
            <Ionicons
                name={icon}
                size={18}
                color={filter === value ? color : colors.textLight}
            />
            <Text
                style={[
                    styles.filterChipText,
                    filter === value && { color: color },
                ]}
            >
                {label}
            </Text>
            <View
                style={[
                    styles.badge,
                    filter === value && { backgroundColor: color },
                ]}
            >
                <Text
                    style={[
                        styles.badgeText,
                        filter === value && styles.badgeTextActive,
                    ]}
                >
                    {count}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Stats Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Ionicons name="book" size={32} color={colors.primary} />
                    <Text style={styles.summaryValue}>{enrolledCourses.length}</Text>
                    <Text style={styles.summaryLabel}>Total Enrolled</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Ionicons name="play-circle" size={32} color={colors.warning} />
                    <Text style={styles.summaryValue}>{inProgressCourses.length}</Text>
                    <Text style={styles.summaryLabel}>In Progress</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                    <Text style={styles.summaryValue}>{completedCourses.length}</Text>
                    <Text style={styles.summaryLabel}>Completed</Text>
                </View>
            </View>

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
                <FilterChip
                    icon="list"
                    label="All"
                    value="all"
                    count={enrolledCourses.length}
                    color={colors.primary}
                />
                <FilterChip
                    icon="play-circle"
                    label="In Progress"
                    value="in-progress"
                    count={inProgressCourses.length}
                    color={colors.warning}
                />
                <FilterChip
                    icon="checkmark-circle"
                    label="Completed"
                    value="completed"
                    count={completedCourses.length}
                    color={colors.success}
                />
            </ScrollView>

            {/* Courses List */}
            <ScrollView
                style={styles.coursesList}
                showsVerticalScrollIndicator={false}
            >
                {getFilteredCourses().map((course) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        onPress={() => console.log('Course pressed:', course.id)}
                        showProgress={true}
                    />
                ))}
                {getFilteredCourses().length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={64} color={colors.textLight} />
                        <Text style={styles.emptyText}>No courses found</Text>
                        <Text style={styles.emptySubtext}>Start learning to see your progress here</Text>
                    </View>
                )}
            </ScrollView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.xxl,
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    summaryCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    summaryValue: {
        ...typography.h2,
        marginTop: spacing.sm,
    },
    summaryLabel: {
        ...typography.caption,
        textAlign: 'center',
    },
    filtersContainer: {
        marginBottom: spacing.md,
    },
    filtersContent: {
        paddingHorizontal: spacing.md,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.sm,
    },
    filterChipActive: {
        borderWidth: 2,
    },
    filterChipText: {
        ...typography.body2,
        fontWeight: '600',
        color: colors.textLight,
        marginLeft: spacing.xs,
    },
    badge: {
        backgroundColor: colors.divider,
        borderRadius: 10,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        minWidth: 24,
        alignItems: 'center',
        marginLeft: spacing.xs,
    },
    badgeText: {
        ...typography.caption,
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.text,
    },
    badgeTextActive: {
        color: colors.textWhite,
    },
    coursesList: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        marginTop: spacing.xxl,
    },
    emptyText: {
        ...typography.h4,
        color: colors.textLight,
        marginTop: spacing.md,
    },
    emptySubtext: {
        ...typography.body2,
        color: colors.textLight,
        marginTop: spacing.xs,
    },
});

export default ViewingHistoryScreen;
