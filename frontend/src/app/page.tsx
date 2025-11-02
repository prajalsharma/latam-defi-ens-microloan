'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Dashboard from '../components/Dashboard';
import LoanManager from '../components/LoanManager';
import ENSIdentity from '../components/ENSIdentity';
import DepositVault from '../components/DepositVault';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';
import WelcomeModal from '../components/modals/WelcomeModal';
import { Toaster } from '../components/ui/Toaster';

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userProfile, setUserProfile] = useState({
    ensName: null as string | null,
    creditScore: 650,
    totalLoans: 0,
    totalDeposits: 0
  });

  useEffect(() => {
    if (isConnected && !localStorage.getItem('welcomed')) {
      setShowWelcome(true);
    }
  }, [isConnected]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomed', 'true');
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  LATAM DeFi
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Microloans and digital identity for the underbanked in Latin America
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => connect({ connector: metaMask() })}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  </svg>
                  <span>Connect MetaMask</span>
                </button>
                
                <button
                  onClick={() => connect({ connector: injected() })}
                  className="w-full bg-white border-2 border-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center space-x-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Browser Wallet</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Supports Arbitrum Sepolia testnet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard userProfile={userProfile} />;
      case 'loans':
        return <LoanManager />;
      case 'ens':
        return <ENSIdentity />;
      case 'deposit':
        return <DepositVault />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="lg:pl-72">
        <Header 
          address={address}
          chainId={chainId}
          onDisconnect={disconnect}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {showWelcome && (
        <WelcomeModal 
          isOpen={showWelcome}
          onClose={handleWelcomeComplete}
          userAddress={address}
        />
      )}
      
      <Toaster />
    </div>
  );
}