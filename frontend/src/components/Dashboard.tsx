'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import StatsCard from './ui/StatsCard';
import QuickActions from './ui/QuickActions';
import RecentActivity from './ui/RecentActivity';
import CreditScoreCard from './ui/CreditScoreCard';
import MarketOverview from './ui/MarketOverview';

interface UserProfile {
  ensName: string | null;
  creditScore: number;
  totalLoans: number;
  totalDeposits: number;
}

interface DashboardProps {
  userProfile: UserProfile;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const { address } = useAccount();
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    totalEarned: 0,
    activeLoans: 0,
    portfolioValue: 0
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'loan_request',
      amount: 250,
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Microloan approved for maria.latam.eth'
    },
    {
      id: 2,
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      description: 'USDC deposited to earn vault'
    },
    {
      id: 3,
      type: 'loan_repay',
      amount: 105,
      status: 'completed',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      description: 'Loan repayment from juan.latam.eth'
    }
  ]);

  const quickActions = [
    {
      title: 'Request Microloan',
      description: 'Get up to $1,000 USDC',
      icon: 'banknotes',
      color: 'blue',
      action: () => {}
    },
    {
      title: 'Earn Yield',
      description: 'Deposit USDC for 8% APY',
      icon: 'trending-up',
      color: 'green',
      action: () => {}
    },
    {
      title: 'Claim ENS',
      description: 'Get your .latam.eth identity',
      icon: 'identification',
      color: 'purple',
      action: () => {}
    },
    {
      title: 'Send Payment',
      description: 'Pay to ENS names instantly',
      icon: 'paper-airplane',
      color: 'orange',
      action: () => {}
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              {userProfile.ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Credit Score: {userProfile.creditScore}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span>Active Loans: {stats.activeLoans}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Borrowed"
          value={`$${stats.totalBorrowed.toLocaleString()}`}
          change="+12%"
          trend="up"
          icon="banknotes"
        />
        <StatsCard
          title="Total Earned"
          value={`$${stats.totalEarned.toLocaleString()}`}
          change="+8.2%"
          trend="up"
          icon="trending-up"
        />
        <StatsCard
          title="Active Loans"
          value={stats.activeLoans.toString()}
          change="-2"
          trend="down"
          icon="document-text"
        />
        <StatsCard
          title="Portfolio Value"
          value={`$${stats.portfolioValue.toLocaleString()}`}
          change="+15.3%"
          trend="up"
          icon="chart-bar"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Credit Score & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CreditScoreCard 
              score={userProfile.creditScore}
              trend="up"
              lastUpdated={new Date()}
            />
            <MarketOverview />
          </div>
          
          <QuickActions actions={quickActions} />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity activities={recentActivity} />
        </div>
      </div>
    </div>
  );
}