'use client';

import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import TeacherLayout from '@/components/Layout/TeacherLayout';
import WithdrawForm from '@/components/Teacher/WithdrawForm';
import { HiCurrencyRupee, HiBanknotes, HiClock, HiArrowDownCircle, HiArrowUpCircle } from 'react-icons/hi2';

export default function WalletPage() {
    const { data: earnings, loading, setData } = useFetch(() => api.getTeacherEarnings());

    const handleWithdraw = (amount) => {
        // Optimistically update UI
        setData(prev => ({
            ...prev,
            balance: prev.balance - amount,
            transactions: [
                {
                    id: Date.now(),
                    type: 'withdrawal',
                    amount: amount,
                    description: 'Withdrawal Request',
                    date: new Date().toISOString(),
                    status: 'pending'
                },
                ...prev.transactions
            ]
        }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <TeacherLayout activeTab="wallet">
            <div className="max-w-6xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Wallet & Earnings</h1>
                    <p className="text-secondary-600">Track your revenue and manage withdrawals.</p>
                </div>

                {/* Earnings Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-secondary-50 rounded-lg">
                                <HiCurrencyRupee className="w-6 h-6 text-secondary-900" />
                            </div>
                            <span className="text-sm font-medium text-secondary-600">Total Earnings</span>
                        </div>
                        <p className="text-3xl font-bold text-secondary-900">₹12,450</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-secondary-50 rounded-lg">
                                <HiBanknotes className="w-6 h-6 text-secondary-900" />
                            </div>
                            <span className="text-sm font-medium text-secondary-600">Available Balance</span>
                        </div>
                        <p className="text-3xl font-bold text-secondary-900">₹2,450</p>
                        <p className="text-xs text-secondary-500 mt-1">Min. withdrawal: ₹100</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-secondary-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-secondary-50 rounded-lg">
                                <HiClock className="w-6 h-6 text-secondary-900" />
                            </div>
                            <span className="text-sm font-medium text-secondary-600">Pending Payout</span>
                        </div>
                        <p className="text-3xl font-bold text-secondary-900">₹0.00</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transaction History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-secondary-200">
                                <h3 className="font-bold text-secondary-900">Transaction History</h3>
                            </div>
                            <div className="divide-y divide-secondary-100">
                                {earnings?.transactions?.map((txn) => (
                                    <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-secondary-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${txn.type === 'earning' ? 'bg-success-50' : 'bg-primary-50'
                                                }`}>
                                                {txn.type === 'earning' ? (
                                                    <HiArrowDownCircle className="w-5 h-5 text-success-600" />
                                                ) : (
                                                    <HiArrowUpCircle className="w-5 h-5 text-primary-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-secondary-900">{txn.description}</p>
                                                <p className="text-xs text-secondary-500">
                                                    {new Date(txn.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${txn.type === 'earning' ? 'text-success-600' : 'text-secondary-900'
                                            }`}>
                                            {txn.type === 'earning' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Withdraw Form */}
                    <div className="lg:col-span-1">
                        <WithdrawForm maxAmount={earnings?.balance} onWithdraw={handleWithdraw} />
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
