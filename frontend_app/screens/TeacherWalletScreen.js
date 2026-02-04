import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { teacherStats, teacherProfile, teacherTransactions } from '../constants/mockData';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatCurrency } from '../utils/helpers';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';

const TeacherWalletScreen = () => {
    const { user } = useAuth();
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [bankAccount, setBankAccount] = useState('');

    const handleWithdraw = () => {
        if (!withdrawAmount || !bankAccount) {
            Alert.alert('Error', 'Please enter amount and bank account details');
            return;
        }

        Alert.alert(
            'Success',
            `Withdrawal request for ₹${withdrawAmount} sent successfully!`,
            [{
                text: 'OK', onPress: () => {
                    setWithdrawAmount('');
                    setBankAccount('');
                }
            }]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Balance Cards */}
            <View style={styles.balanceContainer}>
                <BalanceCard
                    icon="cash"
                    label="Total Earnings"
                    value={formatCurrency(teacherStats.totalEarnings)}
                    color={colors.primary}
                    style={{ flex: 1, marginRight: spacing.sm }}
                />
                <BalanceCard
                    icon="wallet"
                    label="Available"
                    value={formatCurrency(teacherProfile.availableBalance)}
                    color={colors.success}
                    style={{ flex: 1, marginLeft: spacing.sm }}
                />
            </View>

            {/* Withdraw Funds Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="card-outline" size={24} color={colors.primary} />
                    <Text style={styles.cardTitle}>Withdraw Earnings</Text>
                </View>

                <Text style={styles.label}>Amount to Withdraw</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChangeText={setWithdrawAmount}
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textLight}
                />

                <Text style={styles.label}>Bank Account Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Account Number"
                    value={bankAccount}
                    onChangeText={setBankAccount}
                    keyboardType="number-pad"
                    placeholderTextColor={colors.textLight}
                />

                <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                    <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
                </TouchableOpacity>
            </View>

            {/* Transaction History */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transaction History</Text>
                <View style={styles.transactionsList}>
                    {teacherTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                </View>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: spacing.xxl,
    },
    balanceContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: colors.surface,
        margin: spacing.md,
        marginTop: 0,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardTitle: {
        ...typography.h3,
        marginLeft: spacing.sm,
    },
    label: {
        ...typography.body2,
        fontWeight: '600',
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.text,
        ...typography.body1,
    },
    withdrawButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.lg,
        ...shadows.md,
    },
    withdrawButtonText: {
        ...typography.button,
        color: colors.textWhite,
    },
    section: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    transactionsList: {
        marginTop: spacing.xs,
    },
});

export default TeacherWalletScreen;
