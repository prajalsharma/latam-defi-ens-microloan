'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { arbitrumSepolia } from 'viem/chains';
import { config } from '../lib/wagmi';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'your-privy-app-id'}
      config={{
        supportedChains: [arbitrumSepolia],
        loginMethods: ['wallet', 'email', 'google', 'twitter'],
        appearance: {
          theme: 'light',
          accentColor: '#2563eb',
          logo: '🇲🇽',
          walletList: ['metamask', 'coinbase_wallet', 'wallet_connect', 'detected_wallets'],
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: arbitrumSepolia,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}