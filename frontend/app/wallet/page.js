'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import AddFunds from '@/components/Wallet/AddFunds';
import TransactionHistory from '@/components/Wallet/TransactionHistory';
import { useWallet, useFetch } from '@/lib/hooks';
import { HiWallet, HiLockClosed, HiCurrencyDollar } from 'react-icons/hi2';
import api from '@/lib/api';

export default function WalletPage() {
    const { balance, lockedAmount, availableBalance, loading } = useWallet();
    const { data: transactionData } = useFetch(() => api.getTransactions());
    const [transactions, setTransactions] = useState(transactionData?.transactions || []);

    const handleFundsAdded = (newBalance) => {
        // Refresh transaction data
        api.getTransactions().then(data => {
            setTransactions(data.transactions || data);
        });
    };

    return (
        <DashboardLayout activeTab="wallet">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Wallet</h1>
                    <p className="text-secondary-600">Manage your funds and view transactions</p>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-soft border border-secondary-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-secondary-600 text-sm">Total Balance</p>
                            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                <HiWallet className="w-5 h-5 text-secondary-900" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold mb-2 text-secondary-900">
                            {loading ? '...' : `₹${balance.toFixed(2)}`}
                        </p>
                        <p className="text-secondary-500 text-sm">Available for sessions</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-soft border border-secondary-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-secondary-600 text-sm">Available Balance</p>
                            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                <HiCurrencyDollar className="w-5 h-5 text-secondary-900" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-secondary-900 mb-2">
                            {loading ? '...' : `₹${availableBalance.toFixed(2)}`}
                        </p>
                        <p className="text-secondary-500 text-sm">Ready to use</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-soft border border-secondary-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-secondary-600 text-sm">Locked Amount</p>
                            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                <HiLockClosed className="w-5 h-5 text-secondary-900" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-secondary-900 mb-2">
                            {loading ? '...' : `₹${lockedAmount.toFixed(2)}`}
                        </p>
                        <p className="text-secondary-500 text-sm">In active sessions</p>
                    </div>
                </div>

                {/* Add Funds and Transaction History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Funds */}
                    <div className="lg:col-span-1">
                        <AddFunds onSuccess={handleFundsAdded} />
                    </div>

                    {/* Transaction History */}
                    <div className="lg:col-span-2">
                        <TransactionHistory transactions={transactions} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
