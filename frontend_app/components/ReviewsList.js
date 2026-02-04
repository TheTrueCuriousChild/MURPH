import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const ReviewsList = ({ data }) => {
    const renderRating = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={14}
                    color={colors.warning}
                />
            );
        }
        return <View style={styles.starContainer}>{stars}</View>;
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.header}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View style={styles.ratingRow}>
                {renderRating(item.rating)}
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>User Reviews</Text>
                <TouchableOpacity style={styles.writeButton}>
                    <Text style={styles.writeButtonText}>Write a Review</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    summaryTitle: {
        ...typography.h3,
    },
    writeButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        backgroundColor: colors.primary + '15',
        borderRadius: borderRadius.round,
    },
    writeButtonText: {
        ...typography.button,
        color: colors.primary,
        fontSize: 12,
    },
    listContent: {
        padding: spacing.md,
    },
    itemContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    user: {
        ...typography.body2,
        fontWeight: 'bold',
        color: colors.text,
    },
    date: {
        ...typography.caption,
        color: colors.textLight,
    },
    ratingRow: {
        marginVertical: spacing.xs,
    },
    starContainer: {
        flexDirection: 'row',
    },
    comment: {
        ...typography.body2,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});

export default ReviewsList;
