import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../constants/config';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const StudentCourseDetailsScreen = ({ navigation, route }) => {
    const { courseId } = route.params;
    const { token } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };

            // Note: Endpoint matching user.routes.js: /user/courses/:id 
            // Depending on how app.use('/api/user', userRouter) is set up in server.js
            const response = await fetch(`${API_URL}/user/courses/${courseId}`, {
                headers: headers
            });
            const data = await response.json();

            if (data.success) {
                setCourse(data.data);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch course details");
                navigation.goBack();
            }
        } catch (error) {
            console.error("Fetch course details error:", error);
            Alert.alert("Error", "Network error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!course) return null;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Course Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Course Info Card */}
                <View style={styles.card}>
                    <Text style={styles.title}>{course.title}</Text>
                    <Text style={styles.description}>{course.description}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Ionicons name="videocam" size={16} color={colors.primary} />
                            <Text style={styles.statText}>
                                {course.lectures ? course.lectures.length : 0} Lectures
                            </Text>
                        </View>
                        <View style={styles.stat}>
                            <Ionicons name="time" size={16} color={colors.primary} />
                            <Text style={styles.statText}>Updated Recently</Text>
                        </View>
                    </View>
                </View>

                {/* Lectures List */}
                <Text style={styles.sectionTitle}>Lectures</Text>

                {course.lectures && course.lectures.map((lecture, index) => (
                    <TouchableOpacity
                        key={lecture.id}
                        style={styles.lectureCard}
                        onPress={() => navigation.navigate('VideoPlayer', {
                            // videoUrl: lecture.videoUrl, // REMOVED: Force Session Creation for Students
                            title: lecture.title,
                            description: lecture.description,
                            courseId: courseId,
                            lectureId: lecture.id
                        })}
                    >
                        <View style={styles.lectureIcon}>
                            <Ionicons name="play-circle" size={32} color={colors.primary} />
                        </View>
                        <View style={styles.lectureInfo}>
                            <Text style={styles.lectureTitle}>{lecture.title}</Text>
                            <Text style={styles.lectureDesc} numberOfLines={1}>{lecture.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {(!course.lectures || course.lectures.length === 0) && (
                    <Text style={styles.emptyText}>No lectures available yet.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        backgroundColor: colors.surface,
        marginTop: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        ...typography.h3,
    },
    content: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    description: {
        ...typography.body1,
        color: colors.textLight,
        marginBottom: spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    lectureCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    lectureIcon: {
        marginRight: spacing.md,
    },
    lectureInfo: {
        flex: 1,
    },
    lectureTitle: {
        ...typography.h4,
        marginBottom: 2,
    },
    lectureDesc: {
        ...typography.caption,
        marginBottom: 6,
    },
    emptyText: {
        textAlign: 'center',
        color: colors.textLight,
        marginTop: spacing.lg,
    },
});

export default StudentCourseDetailsScreen;
