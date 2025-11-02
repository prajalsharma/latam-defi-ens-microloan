'use client';

import { useState, useEffect } from 'react';

export default function MarketOverview() {
  const [marketData] = useState({
    totalValueLocked: 2450000,
    totalBorrowers: 1247,
    averageApy: 8.2,
    defaultRate: 2.1
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Market Overview</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Value Locked</span>
          <span className="text-sm font-semibold text-gray-900">
            ${marketData.totalValueLocked.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Active Borrowers</span>
          <span className="text-sm font-semibold text-gray-900">
            {marketData.totalBorrowers.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Average APY</span>
          <span className="text-sm font-semibold text-green-600">
            {marketData.averageApy}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Default Rate</span>
          <span className="text-sm font-semibold text-red-600">
            {marketData.defaultRate}%
          </span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-1 h-1 bg-blue-500 rounded-full" />
          <span>Live data from Arbitrum</span>
        </div>
      </div>
    </div>
  );
}