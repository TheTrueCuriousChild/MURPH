import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { formatDateTime, formatCurrency } from '../utils/helpers';

const TransactionItem = ({ transaction }) => {
    const getIconAndColor = () => {
        switch (transaction.type) {
            case 'credit':
                return { icon: 'arrow-down-circle', color: colors.success };
            case 'debit':
                return { icon: 'arrow-up-circle', color: colors.error };
            case 'locked':
                return { icon: 'lock-closed', color: colors.warning };
            default:
                return { icon: 'swap-horizontal', color: colors.textLight };
        }
    };

    const { icon, color } = getIconAndColor();
    const isNegative = transaction.amount < 0;

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>

            <View style={styles.content}>
                <Text style={styles.description}>{transaction.description}</Text>
                <Text style={styles.date}>{formatDateTime(transaction.date)}</Text>
            </View>

            <Text style={[styles.amount, { color: isNegative ? colors.error : colors.success }]}>
                {isNegative ? '-' : '+'}{formatCurrency(transaction.amount)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    description: {
        ...typography.body2,
        fontWeight: '600',
        marginBottom: spacing.xs / 2,
    },
    date: {
        ...typography.caption,
    },
    amount: {
        ...typography.body1,
        fontWeight: '700',
    },
});

export default TransactionItem;
