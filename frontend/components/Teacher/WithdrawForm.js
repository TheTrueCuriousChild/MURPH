'use client';

import { useState } from 'react';
import { HiCurrencyRupee } from 'react-icons/hi2';

export default function WithdrawForm({ maxAmount, onWithdraw }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            onWithdraw(parseFloat(amount));
            setAmount('');
            setTimeout(() => setSuccess(false), 3000);
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-secondary-200">
            <h3 className="font-bold text-lg text-secondary-900 mb-4">Withdraw Earnings</h3>

            {success && (
                <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-lg text-sm font-medium">
                    Withdrawal request submitted successfully!
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Amount to Withdraw (₹)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-secondary-500">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            max={maxAmount}
                            min="100"
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            required
                        />
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                        Available: ₹{maxAmount?.toLocaleString()}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Bank Account
                    </label>
                    <select className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                        <option>HDFC Bank - **** 1234</option>
                        <option>SBI - **** 5678</option>
                        <option value="new">+ Add New Bank Account</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !amount || parseFloat(amount) > maxAmount}
                    className={`w-full py-2 rounded-lg font-medium text-white transition-all ${loading || !amount || parseFloat(amount) > maxAmount
                            ? 'bg-secondary-300 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 shadow-sm'
                        }`}
                >
                    {loading ? 'Processing...' : 'Request Withdrawal'}
                </button>
            </div>
        </form>
    );
}
