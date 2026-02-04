import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const TeacherVideoCard = ({ video, onPress }) => { // No change needed here, just logic in parent.
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{video.title}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Ionicons name="eye-outline" size={14} color={colors.textLight} />
                        <Text style={styles.statText}>{video.views}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="star" size={14} color={colors.warning} />
                        <Text style={styles.statText}>{video.rating}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
                        <Text style={styles.statText}>{video.uploadDate}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.status, { color: video.status === 'published' ? colors.success : colors.warning }]}>
                        {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                    </Text>
                    <Text style={styles.price}>${video.pricePerMinute}/min</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        padding: spacing.sm,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    thumbnail: {
        width: 100,
        height: 80,
        borderRadius: borderRadius.md,
        backgroundColor: colors.divider,
    },
    content: {
        flex: 1,
        marginLeft: spacing.md,
        justifyContent: 'space-between',
    },
    title: {
        ...typography.body1, // Using smaller font for list items
        fontWeight: '600',
        color: colors.text,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    statText: {
        ...typography.caption,
        marginLeft: spacing.xs,
        color: colors.textLight,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    status: {
        ...typography.caption,
        fontWeight: '600',
    },
    price: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.primary,
    },
});

export default TeacherVideoCard;
