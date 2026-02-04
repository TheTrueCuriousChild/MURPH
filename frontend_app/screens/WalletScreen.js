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
import { transactions as initialTransactions } from '../constants/mockData';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatCurrency, filterTransactions } from '../utils/helpers';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';

const WalletScreen = () => {
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [transactions] = useState(initialTransactions);

    const quickAmounts = [100, 250, 500, 1000];

    const handleAddFunds = () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }
        Alert.alert(
            'Success',
            `₹${amount} has been added to your wallet via ${paymentMethod === 'card' ? 'Credit Card' : 'UPI'}`,
            [{ text: 'OK', onPress: () => setAmount('') }]
        );
    };

    const FilterButton = ({ label, value, count }) => (
        <TouchableOpacity
            style={[
                styles.filterButton,
                transactionFilter === value && styles.filterButtonActive,
            ]}
            onPress={() => setTransactionFilter(value)}
        >
            <Text
                style={[
                    styles.filterButtonText,
                    transactionFilter === value && styles.filterButtonTextActive,
                ]}
            >
                {label} {count !== undefined && `(${count})`}
            </Text>
        </TouchableOpacity>
    );

    const filteredTransactions = filterTransactions(transactions, transactionFilter);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Balance Cards */}
            <View style={styles.balanceContainer}>
                <BalanceCard
                    icon="wallet"
                    label="Total Balance"
                    value={formatCurrency(user?.totalBalance || 0)}
                    color={colors.primary}
                />
                <BalanceCard
                    icon="cash"
                    label="Available"
                    value={formatCurrency(user?.availableBalance || 0)}
                    color={colors.success}
                />
                <BalanceCard
                    icon="lock-closed"
                    label="Locked"
                    value={formatCurrency(user?.lockedAmount || 0)}
                    color={colors.warning}
                />
            </View>

            {/* Add Funds Card */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="add-circle" size={24} color={colors.primary} />
                    <Text style={styles.cardTitle}>Add Funds</Text>
                </View>

                <Text style={styles.label}>Enter Amount</Text>
                <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholderTextColor={colors.textLight}
                />

                <Text style={styles.label}>Quick Select</Text>
                <View style={styles.quickAmounts}>
                    {quickAmounts.map((quickAmount) => (
                        <TouchableOpacity
                            key={quickAmount}
                            style={styles.quickButton}
                            onPress={() => setAmount(quickAmount.toString())}
                        >
                            <Text style={styles.quickButtonText}>₹{quickAmount}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Payment Method</Text>
                <View style={styles.paymentMethods}>
                    <TouchableOpacity
                        style={[
                            styles.paymentButton,
                            paymentMethod === 'card' && styles.paymentButtonActive,
                        ]}
                        onPress={() => setPaymentMethod('card')}
                    >
                        <Ionicons
                            name="card"
                            size={20}
                            color={paymentMethod === 'card' ? colors.textWhite : colors.primary}
                        />
                        <Text
                            style={[
                                styles.paymentButtonText,
                                paymentMethod === 'card' && styles.paymentButtonTextActive,
                            ]}
                        >
                            Card
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentButton,
                            paymentMethod === 'upi' && styles.paymentButtonActive,
                        ]}
                        onPress={() => setPaymentMethod('upi')}
                    >
                        <Ionicons
                            name="phone-portrait"
                            size={20}
                            color={paymentMethod === 'upi' ? colors.textWhite : colors.primary}
                        />
                        <Text
                            style={[
                                styles.paymentButtonText,
                                paymentMethod === 'upi' && styles.paymentButtonTextActive,
                            ]}
                        >
                            UPI
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAddFunds}>
                    <Text style={styles.addButtonText}>Add Amount</Text>
                </TouchableOpacity>
            </View>

            {/* Transaction History */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="time" size={24} color={colors.primary} />
                    <Text style={styles.cardTitle}>Transaction History</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                >
                    <FilterButton
                        label="All"
                        value="all"
                        count={transactions.length}
                    />
                    <FilterButton
                        label="Credit"
                        value="credit"
                        count={transactions.filter(t => t.type === 'credit').length}
                    />
                    <FilterButton
                        label="Debit"
                        value="debit"
                        count={transactions.filter(t => t.type === 'debit').length}
                    />
                    <FilterButton
                        label="Locked"
                        value="locked"
                        count={transactions.filter(t => t.type === 'locked').length}
                    />
                </ScrollView>

                <View style={styles.transactionsList}>
                    {filteredTransactions.map((transaction) => (
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
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    amountInput: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickButton: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
        marginHorizontal: spacing.xs,
    },
    quickButtonText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
    },
    paymentMethods: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 2,
        borderColor: colors.primary,
        marginHorizontal: spacing.xs,
    },
    paymentButtonActive: {
        backgroundColor: colors.primary,
    },
    paymentButtonText: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
        marginLeft: spacing.sm,
    },
    paymentButtonTextActive: {
        color: colors.textWhite,
    },
    addButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.md,
        ...shadows.md,
    },
    addButtonText: {
        ...typography.button,
        color: colors.textWhite,
    },
    filtersContainer: {
        marginBottom: spacing.md,
    },
    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.background,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterButtonText: {
        ...typography.caption,
        color: colors.text,
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: colors.textWhite,
    },
    transactionsList: {
        marginTop: spacing.sm,
    },
});

export default WalletScreen;
