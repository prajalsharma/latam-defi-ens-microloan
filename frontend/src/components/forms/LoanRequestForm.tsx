'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

interface LoanRequestData {
  amount: number;
  ensName: string;
  purpose: string;
  duration: number;
}

interface LoanRequestFormProps {
  onSubmit: (data: LoanRequestData) => void;
}

export default function LoanRequestForm({ onSubmit }: LoanRequestFormProps) {
  const { address } = useAccount();
  const [formData, setFormData] = useState<LoanRequestData>({
    amount: 100,
    ensName: '',
    purpose: '',
    duration: 30
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Loan request failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateInterest = (amount: number, rate: number = 3) => {
    return (amount * rate) / 100;
  };

  const estimatedRate = 3; // Default rate, could be dynamic based on credit score
  const interest = calculateInterest(formData.amount, estimatedRate);
  const totalRepayment = formData.amount + interest;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Request Microloan</h2>
        <p className="text-gray-600 mt-1">Get instant credit with your ENS identity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">$</span>
            </div>
            <input
              type="number"
              min="10"
              max="1000"
              step="10"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">USDC</span>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-sm text-gray-500">
            <span>Minimum: $10</span>
            <span>Maximum: $1,000</span>
          </div>
        </div>

        {/* ENS Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ENS Identity
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.ensName}
              onChange={(e) => setFormData({ ...formData, ensName: e.target.value })}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your-name.latam.eth"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
            </div>
          </div>
          {!formData.ensName && (
            <p className="mt-1 text-sm text-amber-600">
              ⚠️ Register your ENS name first to qualify for loans
            </p>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose (Optional)
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            rows={3}
            className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="What will you use this loan for? (e.g., small business, emergency, education)"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repayment Period
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            className="block w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>

        {/* Loan Summary */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-3">Loan Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Principal Amount:</span>
              <span className="font-medium">${formData.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest ({estimatedRate}%/month):</span>
              <span className="font-medium">${interest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-blue-200">
              <span className="text-blue-900">Total Repayment:</span>
              <span className="text-blue-900">${totalRepayment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Due Date:</span>
              <span>{new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.ensName}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Request $${formData.amount} Loan`
          )}
        </button>
      </form>
    </div>
  );
}