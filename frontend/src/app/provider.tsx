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
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        supportedChains: [arbitrumSepolia],
        loginMethods: ['wallet'],
        externalWallets: {
          disableAllExternalWallets: false,
        },
        appearance: {
          walletList: ['detected_wallets'],
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