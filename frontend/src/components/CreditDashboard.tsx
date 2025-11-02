'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';

interface CreditHistory {
  creditScore: number;
  totalLoansRepaid: number;
  totalDefaulted: number;
  totalBorrowed: string;
  totalRepaymentAmount: string;
  isVerified: boolean;
  walletAddress: string;
}

interface Payment {
  amount: string;
  timestamp: number;
  paymentType: string;
}

export default function CreditDashboard() {
  const { address } = useAccount();
  const [ensNode, setEnsNode] = useState<string>('');
  const [creditHistory, setCreditHistory] = useState<CreditHistory | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demo (replace with actual contract calls)
  const loadCreditHistory = async () => {
    if (!address) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCreditHistory({
        creditScore: 720,
        totalLoansRepaid: 3,
        totalDefaulted: 0,
        totalBorrowed: '1500.00',
        totalRepaymentAmount: '1545.00',
        isVerified: true,
        walletAddress: address,
      });

      setPaymentHistory([
        {
          amount: '515.00',
          timestamp: Date.now() - 86400000 * 30,
          paymentType: 'loan_repayment',
        },
        {
          amount: '515.00',
          timestamp: Date.now() - 86400000 * 60,
          paymentType: 'loan_repayment',
        },
        {
          amount: '515.00',
          timestamp: Date.now() - 86400000 * 90,
          paymentType: 'loan_repayment',
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadCreditHistory();
  }, [address]);

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 700) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 650) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading credit history...</p>
      </div>
    );
  }

  if (!creditHistory) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Credit History</h3>
        <p className="text-gray-600">
          Start by taking your first loan to build your credit history!
        </p>
      </div>
    );
  }

  const repaymentRate = creditHistory.totalLoansRepaid > 0
    ? ((creditHistory.totalLoansRepaid / (creditHistory.totalLoansRepaid + creditHistory.totalDefaulted)) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Credit Score Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Credit Score</h2>
            <p className="text-blue-100">Your ENS Credit Identity</p>
          </div>
          {creditHistory.isVerified && (
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <span className="text-2xl">✓</span>
              <span className="font-semibold">Verified</span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-4">
          <div className="text-7xl font-bold">{creditHistory.creditScore}</div>
          <div className="mb-3">
            <div className="text-2xl font-semibold">
              {getCreditScoreLabel(creditHistory.creditScore)}
            </div>
            <div className="text-blue-100">out of 850</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-6 h-3 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(creditHistory.creditScore / 850) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(creditHistory.totalBorrowed)}
          </div>
          <div className="text-sm text-gray-600">Total Borrowed</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {creditHistory.totalLoansRepaid}
          </div>
          <div className="text-sm text-gray-600">Loans Repaid</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-blue-600">{repaymentRate}%</div>
          <div className="text-sm text-gray-600">Repayment Rate</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="text-3xl mb-2">💸</div>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(creditHistory.totalRepaymentAmount)}
          </div>
          <div className="text-sm text-gray-600">Total Repaid</div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📜 Payment History</h3>

        {paymentHistory.length > 0 ? (
          <div className="space-y-3">
            {paymentHistory.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {payment.paymentType.replace('_', ' ').toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(payment.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="text-xs text-gray-500">USDC</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No payment history yet
          </div>
        )}
      </div>

      {/* ENS Benefits Card */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          🎯 ENS Credit Benefits
        </h3>
        <ul className="space-y-2 text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Your credit score is tied to your ENS identity forever</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Build reputation across multiple DeFi platforms</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Lower interest rates as your score improves</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Share your credit history via ENS subdomain</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

