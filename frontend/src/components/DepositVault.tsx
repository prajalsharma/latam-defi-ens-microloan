'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import DepositForm from './forms/DepositForm';
import WithdrawForm from './forms/WithdrawForm';
import YieldChart from './ui/YieldChart';
import PoolStats from './ui/PoolStats';
import { Tab } from '@headlessui/react';
import { cn } from '../utils/cn';

interface UserDeposit {
  amount: number;
  apy: number;
  earned: number;
  depositDate: Date;
}

export default function DepositVault() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState(0);
  const [userDeposit] = useState<UserDeposit>({
    amount: 1500,
    apy: 8.2,
    earned: 45.60,
    depositDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  });

  const poolStats = {
    totalDeposits: 2450000,
    totalLoans: 1890000,
    utilizationRate: 77,
    currentApy: 8.2,
    totalDepositors: 1247
  };

  const tabs = [
    { name: 'Deposit', icon: 'plus' },
    { name: 'Withdraw', icon: 'minus' },
    { name: 'Analytics', icon: 'chart' }
  ];

  const IconComponent = ({ name, className }: { name: string; className: string }) => {
    const icons: Record<string, JSX.Element> = {
      plus: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      minus: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
      chart: (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    };
    return icons[name] || icons.chart;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earn Yield</h1>
        <p className="text-gray-600 mt-1">
          Deposit USDC to earn competitive yields while supporting microloans
        </p>
      </div>

      {/* Current Position */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Your Deposit</p>
            <p className="text-2xl font-bold text-gray-900">${userDeposit.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Current APY</p>
            <p className="text-2xl font-bold text-green-600">{userDeposit.apy}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Earned</p>
            <p className="text-2xl font-bold text-green-600">${userDeposit.earned.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Days Active</p>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor((Date.now() - userDeposit.depositDate.getTime()) / (1000 * 60 * 60 * 24))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deposit/Withdraw Interface */}
        <div className="lg:col-span-2">
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    cn(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-green-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-green-700'
                    )
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    <IconComponent name={tab.icon} className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            
            <Tab.Panels>
              <Tab.Panel className="focus:outline-none">
                <DepositForm 
                  onDeposit={(amount) => console.log('Depositing:', amount)}
                  currentApy={poolStats.currentApy}
                />
              </Tab.Panel>
              
              <Tab.Panel className="focus:outline-none">
                <WithdrawForm 
                  onWithdraw={(amount) => console.log('Withdrawing:', amount)}
                  availableBalance={userDeposit.amount}
                  earned={userDeposit.earned}
                />
              </Tab.Panel>
              
              <Tab.Panel className="focus:outline-none">
                <YieldChart />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Pool Statistics */}
        <div>
          <PoolStats stats={poolStats} />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          How Yield is Generated
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium text-blue-900">You deposit USDC</p>
              <p className="text-sm text-blue-700 mt-1">
                Your stablecoins are pooled with other depositors
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium text-blue-900">Funds are lent out</p>
              <p className="text-sm text-blue-700 mt-1">
                Verified ENS users borrow at competitive rates (2-4% monthly)
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium text-blue-900">Interest is shared</p>
              <p className="text-sm text-blue-700 mt-1">
                You earn yield from loan repayments minus small protocol fee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}