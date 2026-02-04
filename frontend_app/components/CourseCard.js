import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatCurrency } from '../utils/helpers';

const CourseCard = ({ course, onPress, showProgress = false }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
                <Text style={styles.instructor} numberOfLines={1}>{course.instructor}</Text>

                <View style={styles.meta}>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={14} color={colors.warning} />
                        <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                    <Text style={styles.cost}>{formatCurrency(course.costPerMinute)}/min</Text>
                </View>

                {showProgress && course.progress > 0 && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{course.progress}%</Text>
                    </View>
                )}

                {course.completed && (
                    <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                        <Text style={styles.completedText}>Completed</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        ...shadows.md,
    },
    thumbnail: {
        width: '100%',
        height: 150,
        backgroundColor: colors.divider,
    },
    content: {
        padding: spacing.md,
    },
    title: {
        ...typography.h4,
        marginBottom: spacing.xs,
    },
    instructor: {
        ...typography.body2,
        color: colors.textLight,
        marginBottom: spacing.sm,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        ...typography.body2,
        marginLeft: spacing.xs,
        color: colors.text,
    },
    cost: {
        ...typography.body2,
        fontWeight: '600',
        color: colors.primary,
    },
    progressContainer: {
        marginTop: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: colors.divider,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        marginRight: spacing.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.sm,
    },
    progressText: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.primary,
    },
    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    completedText: {
        ...typography.caption,
        color: colors.success,
        marginLeft: spacing.xs,
        fontWeight: '600',
    },
});

export default CourseCard;
