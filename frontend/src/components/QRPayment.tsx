'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAccount } from 'wagmi';

interface QRPaymentProps {
  ensName?: string;
  amount?: string;
  paymentType?: string;
}

export default function QRPayment({ ensName, amount, paymentType = 'loan_repayment' }: QRPaymentProps) {
  const { address } = useAccount();
  const [showQR, setShowQR] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(amount || '');
  const [customPaymentType, setCustomPaymentType] = useState(paymentType);

  // Generate payment URL with ENS and amount
  const generatePaymentURL = () => {
    const baseURL = window.location.origin;
    const params = new URLSearchParams({
      to: ensName || address || '',
      amount: paymentAmount || '0',
      type: customPaymentType,
    });
    return `${baseURL}/pay?${params.toString()}`;
  };

  // Generate WhatsApp share link
  const generateWhatsAppLink = () => {
    const paymentURL = generatePaymentURL();
    const message = `💰 Pay me via LatamCredit.eth\n\nENS: ${ensName || 'N/A'}\nAmount: $${paymentAmount || '0'} USDC\n\nPay here: ${paymentURL}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePaymentURL());
      alert('Payment link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">💳 QR Payment</h3>
        <button
          onClick={() => setShowQR(!showQR)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </button>
      </div>

      {/* ENS Display */}
      {ensName && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-gray-600">Payment Address (ENS)</div>
          <div className="font-mono font-bold text-green-700">{ensName}</div>
        </div>
      )}

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Amount (USDC)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">$</span>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Type
        </label>
        <select
          value={customPaymentType}
          onChange={(e) => setCustomPaymentType(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="loan_repayment">Loan Repayment</option>
          <option value="direct_payment">Direct Payment</option>
          <option value="service_payment">Service Payment</option>
          <option value="invoice">Invoice Payment</option>
        </select>
      </div>

      {/* QR Code Display */}
      {showQR && paymentAmount && (
        <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200 flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <QRCodeSVG
              value={generatePaymentURL()}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 mt-3 text-center">
            Scan to pay ${paymentAmount} USDC
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={copyToClipboard}
          disabled={!paymentAmount}
          className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <span className="mr-2">📋</span>
          Copy Link
        </button>
        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
            !paymentAmount ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <span className="mr-2">💬</span>
          WhatsApp
        </a>
      </div>

      {/* Payment URL Preview */}
      {paymentAmount && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Payment URL:</p>
          <p className="text-xs font-mono text-gray-700 break-all">
            {generatePaymentURL()}
          </p>
        </div>
      )}

      {/* Web2 Bridge Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          🌐 Web2 Integration
        </h4>
        <p className="text-sm text-blue-800">
          Share this payment link via WhatsApp, SMS, email, or any messaging platform.
          Recipients don't need to know crypto - just click and pay!
        </p>
      </div>
    </div>
  );
}

