import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { API_URL } from '../constants/config';
import { useIsFocused } from '@react-navigation/native';

const TeacherMyCoursesScreen = ({ navigation }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { token } = useAuth();
    const isFocused = useIsFocused();

    const fetchCourses = async () => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/teacher/courses`, {
                method: 'GET',
                headers: headers
            });

            const data = await response.json();

            if (data.success) {
                setCourses(data.data);
            } else {
                console.log('Failed to fetch courses:', data.message);
            }
        } catch (error) {
            console.error('Fetch courses error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchCourses();
        }
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCourses();
    };

    const renderCourseItem = ({ item }) => (
        <View style={styles.courseCard}>
            <View style={styles.courseHeader}>
                <Ionicons name="book" size={24} color={colors.primary} />
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{item.title}</Text>
                    <Text style={styles.courseStats}>
                        {item._count?.lectures || 0} Lectures
                    </Text>
                </View>
            </View>
            <Text style={styles.courseDescription} numberOfLines={2}>
                {item.description}
            </Text>
            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => navigation.navigate('TeacherCourseDetails', { courseId: item.id })}
            >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Courses</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('CreateCourse')}
                >
                    <Ionicons name="add" size={24} color={colors.textWhite} />
                    <Text style={styles.addButtonText}>Create</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={courses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="book-outline" size={64} color={colors.textLight} />
                            <Text style={styles.emptyText}>No courses created yet</Text>
                            <Text style={styles.emptySubtext}>Create your first course to get started!</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: 60,
        paddingBottom: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.h2,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
    },
    addButtonText: {
        color: colors.textWhite,
        marginLeft: spacing.xs,
        fontWeight: '600',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: spacing.md,
        flexGrow: 1,
    },
    courseCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    courseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    courseInfo: {
        marginLeft: spacing.md,
        flex: 1,
    },
    courseTitle: {
        ...typography.h3,
        fontSize: 16,
    },
    courseStats: {
        ...typography.caption,
        color: colors.textLight,
    },
    courseDescription: {
        ...typography.body2,
        color: colors.text,
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: spacing.sm,
        paddingTop: spacing.xs,
    },
    viewDetailsText: {
        ...typography.button,
        color: colors.primary,
        fontSize: 14,
        marginRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        ...typography.h3,
        color: colors.textLight,
        marginTop: spacing.md,
    },
    emptySubtext: {
        ...typography.body2,
        color: colors.textLight,
        marginTop: spacing.xs,
    },
});

export default TeacherMyCoursesScreen;
