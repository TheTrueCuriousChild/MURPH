'use client';

import { useState } from 'react';
import Button from '../UI/Button';
import api from '@/lib/api';

export default function AddFunds({ onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const presetAmounts = [100, 250, 500, 1000];

    const handleAddFunds = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await api.addFunds(parseFloat(amount));
            if (result.success) {
                setAmount('');
                if (onSuccess) onSuccess(result.newBalance);
            }
        } catch (error) {
            console.error('Failed to add funds:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-soft p-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">Add Funds</h3>

            <form onSubmit={handleAddFunds} className="space-y-4">
                {/* Custom Amount */}
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-secondary-700 mb-2">
                        Enter Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-secondary-500">₹</span>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full pl-8 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Preset Amounts */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Quick Select
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {presetAmounts.map(preset => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => setAmount(preset.toString())}
                                className={`px-4 py-2 rounded-lg border-2 transition-colors flex items-center justify-center text-center ${amount === preset.toString()
                                    ? 'border-secondary-900 bg-secondary-100 text-secondary-900'
                                    : 'border-secondary-200 hover:border-secondary-400'
                                    }`}
                            >
                                ₹{preset}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Method (Mock) */}
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Payment Method
                    </label>
                    <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-8 bg-primary-600 rounded flex items-center justify-center text-white text-xs font-bold">
                                CARD
                            </div>
                            <div>
                                <p className="text-sm font-medium text-secondary-900">•••• •••• •••• 4242</p>
                                <p className="text-xs text-secondary-500">Expires 12/25</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={!amount || loading}
                >
                    {loading ? 'Processing...' : `Add ₹${amount || '0.00'}`}
                </Button>
            </form>
        </div>
    );
}
