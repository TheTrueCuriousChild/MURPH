import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

const BalanceCard = ({ icon, label, value, color = colors.primary, variant = 'default', style }) => {
    return (
        <View style={[styles.card, variant === 'horizontal' && styles.cardHorizontal, style]}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flex: 1,
        minWidth: 100,
        marginRight: spacing.sm,
        ...shadows.md,
    },
    cardHorizontal: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    label: {
        ...typography.caption,
        marginBottom: spacing.xs,
    },
    value: {
        ...typography.h3,
        color: colors.text,
    },
});

export default BalanceCard;
