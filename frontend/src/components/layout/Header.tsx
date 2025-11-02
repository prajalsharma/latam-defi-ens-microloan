'use client';

import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import NetworkBadge from '../ui/NetworkBadge';
import { formatAddress } from '../../utils/format';

interface HeaderProps {
  address?: `0x${string}`;
  chainId?: number;
  onDisconnect: () => void;
  onMenuClick: () => void;
}

export default function Header({ address, chainId, onDisconnect, onMenuClick }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <div className="flex items-center space-x-3">
            <NetworkBadge chainId={chainId} />
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          <div className="relative">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {address ? address.slice(2, 4).toUpperCase() : 'XX'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {formatAddress(address)}
                </p>
              </div>
              <button
                onClick={onDisconnect}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}