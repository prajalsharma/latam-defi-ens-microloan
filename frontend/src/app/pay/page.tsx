'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useAccount } from 'wagmi';

function PaymentContent() {
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  
  const toAddress = searchParams.get('to') || '';
  const amount = searchParams.get('amount') || '0';
  const paymentType = searchParams.get('type') || 'direct_payment';

  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setPaying(true);
    // Simulate payment
    setTimeout(() => {
      setSuccess(true);
      setPaying(false);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment of ${amount} USDC has been processed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Transaction Details</div>
            <div className="font-mono text-sm text-gray-800 break-all">
              To: {toAddress}
            </div>
            <div className="font-mono text-sm text-gray-800">
              Amount: ${amount} USDC
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            Review and confirm your payment
          </p>
        </div>

        {/* Payment Details */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Pay To</div>
            <div className="font-mono text-sm font-bold text-blue-900 break-all">
              {toAddress}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Amount</div>
            <div className="text-3xl font-bold text-green-900">
              ${amount} <span className="text-xl text-gray-600">USDC</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Payment Type</div>
            <div className="font-medium text-gray-900 capitalize">
              {paymentType.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isConnected ? (
          <div className="space-y-3">
            <button
              onClick={() => {/* Connect wallet logic */}}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Connect Wallet to Pay
            </button>
            <p className="text-xs text-center text-gray-500">
              You'll need a Web3 wallet with USDC on Arbitrum
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={paying}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {paying ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </span>
              ) : (
                `Pay $${amount} USDC`
              )}
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2 text-sm">
            🌐 Web2 → Web3 Bridge
          </h3>
          <p className="text-xs text-purple-800">
            This payment link can be shared via WhatsApp, SMS, email, or any messaging app.
            Recipients simply click and pay - no crypto knowledge required!
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <span>🔒</span>
            <span>Secured by Arbitrum</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

