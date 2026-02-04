import React from 'react';
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
import { teacherStats, teacherVideos } from '../constants/mockData';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { formatCurrency } from '../utils/helpers';
import BalanceCard from '../components/BalanceCard';
import TeacherVideoCard from '../components/TeacherVideoCard';

const TeacherDashboardScreen = ({ navigation }) => {
    const { user } = useAuth();
    const { width } = Dimensions.get('window');

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header / Welcome */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.username}>{user?.name || 'Teacher'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => navigation.navigate('UploadContent')}
                >
                    <Ionicons name="cloud-upload-outline" size={20} color={colors.textWhite} />
                    <Text style={styles.uploadButtonText}>Upload New</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <View style={styles.statsRow}>
                    <BalanceCard
                        icon="cash-outline"
                        label="Total Earnings"
                        value={formatCurrency(teacherStats.totalEarnings)}
                        color={colors.primary}
                        style={styles.halfCard}
                    />
                    <BalanceCard
                        icon="eye-outline"
                        label="Total Views"
                        value={teacherStats.totalViews.toLocaleString()}
                        color={colors.secondary}
                        style={styles.halfCard}
                    />
                </View>
                <View style={styles.statsRow}>
                    <BalanceCard
                        icon="videocam-outline"
                        label="Total Videos"
                        value={teacherStats.totalVideos.toString()}
                        color={colors.success}
                        style={styles.halfCard}
                    />
                    <BalanceCard
                        icon="star-outline"
                        label="Avg Rating"
                        value={teacherStats.avgRating.toString()}
                        color={colors.warning}
                        style={styles.halfCard}
                    />
                </View>
            </View>

            {/* Recent Videos Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Videos</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MyVideos')}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {teacherVideos.slice(0, 3).map((video) => (
                    <TeacherVideoCard
                        key={video.id}
                        video={video}
                        onPress={() => navigation.navigate('VideoPlayer', {
                            videoParams: {
                                title: video.title,
                                source: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' // Using sample URL for now
                            }
                        })}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    greeting: {
        ...typography.body1,
        color: colors.textLight,
    },
    username: {
        ...typography.h2,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
    },
    uploadButtonText: {
        ...typography.button,
        color: colors.textWhite,
        marginLeft: spacing.xs,
        fontSize: 14,
    },
    statsGrid: {
        marginBottom: spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        // gap: spacing.md, // Removed gap for compatibility
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    // Note: BalanceCard might need `flex: 1` wrapper if not inherent, 
    // but simplified reuse:
    halfCard: {
        // We'll trust flex layout or just let them render. 
        // Existing BalanceCard takes width from parent maybe? 
        // Let's modify BalanceCard implementation if needed or wrap it.
    },
    section: {
        marginBottom: spacing.lg,
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
    viewAllText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
    },
});

export default TeacherDashboardScreen;
