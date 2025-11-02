'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import LoanRequestForm from './forms/LoanRequestForm';
import LoanList from './ui/LoanList';
import LoanStats from './ui/LoanStats';
import { Tab } from '@headlessui/react';
import { cn } from '../utils/cn';

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'active' | 'repaid' | 'overdue';
  borrower: string;
  ensName?: string;
  startDate: Date;
  dueDate: Date;
  amountDue: number;
}

export default function LoanManager() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState(0);
  
  // Mock data - replace with real contract data
  const [loans] = useState<Loan[]>([
    {
      id: '1',
      amount: 500,
      interestRate: 3,
      duration: 30,
      status: 'active',
      borrower: '0x1234...5678',
      ensName: 'maria.latam.eth',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      amountDue: 515
    },
    {
      id: '2',
      amount: 250,
      interestRate: 2.5,
      duration: 30,
      status: 'repaid',
      borrower: '0x8765...4321',
      ensName: 'carlos.latam.eth',
      startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      amountDue: 0
    }
  ]);

  const tabs = [
    { name: 'Request Loan', count: null },
    { name: 'My Loans', count: loans.filter(l => l.status === 'active').length },
    { name: 'Loan History', count: loans.length }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Microloans</h1>
          <p className="text-gray-600 mt-1">Instant credit for the underbanked</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <LoanStats loans={loans} />
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-600 hover:bg-white/[0.12] hover:text-blue-800'
                )
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.name}</span>
                {tab.count !== null && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </div>
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-6">
          <Tab.Panel className="focus:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LoanRequestForm onSubmit={(data) => console.log('Loan request:', data)} />
              </div>
              <div className="space-y-6">
                {/* Loan Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Requirements</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">ENS subdomain (.latam.eth)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Credit score ≥ 500</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Connected Arbitrum wallet</span>
                    </div>
                  </div>
                </div>

                {/* Interest Rates */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Rates</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Excellent (750+)</span>
                      <span className="text-sm font-semibold text-green-600">2.0% / month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Good (700-749)</span>
                      <span className="text-sm font-semibold text-blue-600">2.5% / month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fair (650-699)</span>
                      <span className="text-sm font-semibold text-yellow-600">3.0% / month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Poor (500-649)</span>
                      <span className="text-sm font-semibold text-red-600">4.0% / month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="focus:outline-none">
            <LoanList 
              loans={loans.filter(loan => loan.status === 'active')} 
              title="Active Loans"
              showActions
            />
          </Tab.Panel>
          
          <Tab.Panel className="focus:outline-none">
            <LoanList 
              loans={loans} 
              title="All Loans"
              showActions={false}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}