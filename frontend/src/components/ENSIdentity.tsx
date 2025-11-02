'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import ENSRegistrationForm from './forms/ENSRegistrationForm';
import ENSCard from './ui/ENSCard';
import PaymentInterface from './ui/PaymentInterface';

interface ENSRecord {
  name: string;
  owner: string;
  isVerified: boolean;
  creditScore: number;
  registrationDate: Date;
  expiryDate: Date;
}

export default function ENSIdentity() {
  const { address } = useAccount();
  const [userENS, setUserENS] = useState<ENSRecord | null>({
    name: 'maria.latam.eth',
    owner: address || '',
    isVerified: true,
    creditScore: 720,
    registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  });

  const [availableNames] = useState([
    'carlos.latam.eth',
    'ana.latam.eth', 
    'pedro.latam.eth',
    'sofia.latam.eth'
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ENS Identity</h1>
        <p className="text-gray-600 mt-1">
          Your decentralized identity and payment address for LATAM
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current ENS or Registration */}
        <div className="space-y-6">
          {userENS ? (
            <ENSCard ensRecord={userENS} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No ENS Identity
                </h3>
                <p className="text-gray-600 mb-6">
                  Register your .latam.eth name to get started with microloans and payments
                </p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <ENSRegistrationForm 
            availableNames={availableNames}
            onRegister={(name) => {
              console.log('Registering:', name);
              // Handle registration
            }}
          />
        </div>

        {/* Payment Interface */}
        <div>
          <PaymentInterface 
            userENS={userENS?.name}
            onSendPayment={(recipient, amount) => {
              console.log('Sending payment:', { recipient, amount });
              // Handle payment
            }}
          />
        </div>
      </div>

      {/* ENS Features */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Why use ENS for DeFi?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Simple Payments</h4>
              <p className="text-sm text-gray-600 mt-1">
                Send money to maria.latam.eth instead of long wallet addresses
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Credit Identity</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your ENS name carries your credit history and reputation
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Instant Access</h4>
              <p className="text-sm text-gray-600 mt-1">
                Use across all DeFi platforms with one unified identity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}