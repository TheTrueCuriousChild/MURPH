'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/Layout/StudentLayout';
import { HiCurrencyDollar, HiCreditCard, HiArrowPath, HiPlus } from 'react-icons/hi2';
import { API_URL } from '@/lib/config';

export default function WalletPage() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Mock transactions for now if backend doesn't provide them
    const mockTransactions = [
        { id: 1, type: 'credit', amount: 50.00, description: 'Added Funds', date: '2023-11-01' },
        { id: 2, type: 'debit', amount: 5.00, description: 'Watched: Intro to React', date: '2023-10-25' },
    ];

    useEffect(() => {
        // Hydrate user from local storage
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setBalance(parsedUser.walletBalance || 0);
            }
        }
        setTransactions(mockTransactions);
    }, []);

    const handleAddFunds = async (e) => {
        e.preventDefault();
        if (!amountToAdd || isNaN(amountToAdd) || Number(amountToAdd) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
                alert(`Successfully added $${amountToAdd}`);
                setAmountToAdd('');
                setIsAddFundsOpen(false);

                // Update local state and local storage
                if (data.data && data.data.walletBalance !== undefined) {
                    setBalance(data.data.walletBalance);

                    const updatedUser = { ...user, walletBalance: data.data.walletBalance };
                    setUser(updatedUser);
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                }
            } else {
                alert(data.message || 'Failed to add funds');
            }
        } catch (error) {
            console.error('Add funds error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <StudentLayout activeTab="wallet">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900 mb-2">My Wallet</h1>
                    <p className="text-secondary-600">Manage your funds and payments.</p>
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4 opacity-80">
                            <HiCurrencyDollar className="w-6 h-6" />
                            <span className="font-medium">Total Balance</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">₹{balance.toFixed(2)}</h2>
                        <button
                            onClick={() => setIsAddFundsOpen(true)}
                            className="mt-4 w-full bg-white/20 hover:bg-white/30 transition-colors py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                            <HiPlus className="w-4 h-4" />
                            Add Funds
                        </button>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-secondary-500">
                            <HiCreditCard className="w-6 h-6" />
                            <span className="font-medium">Spent to Date</span>
                        </div>
                        <h2 className="text-3xl font-bold text-secondary-900">₹{user?.totalSpent || '0.00'}</h2>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-secondary-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-secondary-500">
                            <HiArrowPath className="w-6 h-6" />
                            <span className="font-medium">Active Sessions</span>
                        </div>
                        <h2 className="text-3xl font-bold text-secondary-900">0</h2>
                        <p className="text-sm text-secondary-500 mt-1">Currently watching</p>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-secondary-200">
                        <h3 className="font-bold text-lg text-secondary-900">Recent Transactions</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-secondary-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-secondary-500">
                                            No recent transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                                {tx.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                                                {tx.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'credit' ? 'bg-success-100 text-success-700' : 'bg-secondary-100 text-secondary-700'
                                                    }`}>
                                                    {tx.type === 'credit' ? 'Credit' : 'Debit'}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${tx.type === 'credit' ? 'text-success-600' : 'text-secondary-900'
                                                }`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Funds Modal */}
            {isAddFundsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-fadeIn">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-secondary-900">Add Funds</h3>
                                <button
                                    onClick={() => setIsAddFundsOpen(false)}
                                    className="text-secondary-400 hover:text-secondary-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleAddFunds}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                                        Amount (₹)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={amountToAdd}
                                            onChange={(e) => setAmountToAdd(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-4 py-3 text-lg font-bold text-secondary-900 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                            autoFocus
                                            min="1"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-secondary-500 mt-2">
                                        Funds are added instantly to your wallet via secure payment.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {[100, 500, 1000].map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setAmountToAdd(amt.toString())}
                                            className="py-2 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 hover:border-secondary-300 transition-all font-medium"
                                        >
                                            ₹{amt}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddFundsOpen(false)}
                                        className="flex-1 py-2.5 border border-secondary-300 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {loading ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
