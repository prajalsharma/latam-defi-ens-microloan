'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount } from 'wagmi';
import LoanDashboard from '../components/LoanDashboard';
import ENSManager from '../components/ENSManager';
import DepositInterface from '../components/DepositInterface';
import QRPayment from '../components/QRPayment';
import CreditDashboard from '../components/CreditDashboard';

export default function Home() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState('loans');

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              LATAM DeFi 🇲🇽
            </h1>
            <p className="text-gray-600 mb-6">
              ENS-powered microloans for the underbanked
            </p>
            <button
              onClick={login}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Connect Wallet
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Powered by Privy - Connect with wallet, email, or social
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                LATAM DeFi 🌎
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'loans', label: 'Loans', icon: '💰' },
              { id: 'credit', label: 'Credit Score', icon: '📊' },
              { id: 'ens', label: 'ENS Identity', icon: '🆔' },
              { id: 'payment', label: 'QR Payment', icon: '📱' },
              { id: 'deposit', label: 'Earn Yield', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'loans' && <LoanDashboard />}
        {activeTab === 'credit' && <CreditDashboard />}
        {activeTab === 'ens' && <ENSManager />}
        {activeTab === 'payment' && <QRPayment ensName="user.latamcredit.eth" />}
        {activeTab === 'deposit' && <DepositInterface />}
      </main>
    </div>
  );
}