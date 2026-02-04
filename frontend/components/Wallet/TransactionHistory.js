'use client';

import { useState } from 'react';

export default function TransactionHistory({ transactions }) {
    const [filter, setFilter] = useState('all');

    const filteredTransactions = transactions?.filter(txn =>
        filter === 'all' || txn.type === filter
    ) || [];

    const getTypeStyles = (type) => {
        switch (type) {
            case 'credit':
                return 'bg-success-50 text-success-700';
            case 'debit':
                return 'bg-error-50 text-error-700';
            case 'locked':
                return 'bg-warning-50 text-warning-700';
            default:
                return 'bg-secondary-100 text-secondary-700';
        }
    };

    const getTypeLabel = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900">Transaction History</h3>

                {/* Filter */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-1.5 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="all">All Transactions</option>
                    <option value="credit">Credits</option>
                    <option value="debit">Debits</option>
                    <option value="locked">Locked</option>
                </select>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-secondary-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Description</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-secondary-700">Type</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-secondary-700">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-secondary-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map(txn => (
                                <tr key={txn.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                                    <td className="py-3 px-4 text-sm text-secondary-600">
                                        {new Date(txn.date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-secondary-900">
                                        {txn.description}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getTypeStyles(txn.type)}`}>
                                            {getTypeLabel(txn.type)}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-4 text-sm font-medium text-right ${txn.type === 'credit' ? 'text-success-600' : 'text-error-600'
                                        }`}>
                                        {txn.type === 'credit' ? '+' : '-'}${txn.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
