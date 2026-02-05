import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    FlatList,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';
import { formatCurrency, filterTransactions } from '../utils/helpers';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';
import { API_URL } from '../constants/config';
import { transactions as initialTransactions } from '../constants/mockData';

const WalletScreen = () => {
    const { user, token, setUser } = useAuth();
    const [balance, setBalance] = useState(user?.walletBalance || 0);
    const [transactions] = useState(initialTransactions);
    const [isAddFundsVisible, setIsAddFundsVisible] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [loading, setLoading] = useState(false);

    // UI state
    const [transactionFilter, setTransactionFilter] = useState('all');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const quickAmounts = [100, 250, 500, 1000];

    useEffect(() => {
        if (user?.walletBalance !== undefined) {
            setBalance(user.walletBalance);
        }
    }, [user]);

    const handleAddFunds = async () => {
        if (!amountToAdd || isNaN(amountToAdd) || Number(amountToAdd) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid positive amount');
            return;
        }

        setLoading(true);
        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/user/add-funds`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ amount: Number(amountToAdd) }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', `Successfully added ₹${amountToAdd}`);
                setAmountToAdd('');
                setIsAddFundsVisible(false);

                // Update local state and context
                if (data.data && data.data.walletBalance !== undefined) {
                    setBalance(data.data.walletBalance);
                    setUser({ ...user, walletBalance: data.data.walletBalance });
                }
            } else {
                Alert.alert('Error', data.message || 'Failed to add funds');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
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
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Balance Cards */}
                <View style={styles.balanceContainer}>
                    <BalanceCard
                        icon="wallet"
                        label="Total Balance"
                        value={formatCurrency(balance)}
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

                {/* Add Funds Button Section */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="card" size={24} color={colors.primary} />
                        <Text style={styles.cardTitle}>Manage Funds</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addFundsMainButton}
                        onPress={() => setIsAddFundsVisible(true)}
                    >
                        <Ionicons name="add-circle" size={24} color={colors.textWhite} />
                        <Text style={styles.addFundsMainButtonText}>Add Funds to Wallet</Text>
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
                        {filteredTransactions.length === 0 && (
                            <Text style={{ textAlign: 'center', color: colors.textLight, padding: 20 }}>
                                No transactions found
                            </Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Add Funds Modal */}
            <Modal
                transparent={true}
                visible={isAddFundsVisible}
                animationType="slide"
                onRequestClose={() => setIsAddFundsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Funds</Text>

                        <Text style={styles.label}>Enter Amount</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={colors.textLight}
                            keyboardType="decimal-pad"
                            value={amountToAdd}
                            onChangeText={setAmountToAdd}
                        />

                        <Text style={styles.label}>Quick Select</Text>
                        <View style={styles.quickAmounts}>
                            {quickAmounts.map((amt) => (
                                <TouchableOpacity
                                    key={amt}
                                    style={styles.quickButton}
                                    onPress={() => setAmountToAdd(amt.toString())}
                                >
                                    <Text style={styles.quickButtonText}>₹{amt}</Text>
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
                                <Text style={[
                                    styles.paymentButtonText,
                                    paymentMethod === 'card' && styles.paymentButtonTextActive,
                                ]}>Card</Text>
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
                                <Text style={[
                                    styles.paymentButtonText,
                                    paymentMethod === 'upi' && styles.paymentButtonTextActive,
                                ]}>UPI</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsAddFundsVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleAddFunds}
                                disabled={loading}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {loading ? 'Processing...' : 'Add Funds'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
        color: colors.text
    },
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 18,
        color: colors.text,
    },
    addFundsMainButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.sm
    },
    addFundsMainButtonText: {
        ...typography.button,
        color: colors.textWhite,
        marginLeft: spacing.sm,
        fontWeight: 'bold'
    },
    quickAmounts: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md
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
        marginBottom: spacing.lg
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        width: '90%',
        ...shadows.lg,
        maxHeight: '80%'
    },
    modalTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.lg
    },
    modalButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.sm,
    },
    confirmButton: {
        backgroundColor: colors.primary,
        marginLeft: spacing.sm,
    },
    cancelButtonText: {
        color: colors.text,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: colors.textWhite,
        fontWeight: '600',
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
