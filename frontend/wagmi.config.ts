import { defineConfig } from '@wagmi/cli'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'

export default defineConfig({
  out: 'src/lib/wagmi.ts',
  contracts: [],
  plugins: [],
  chains: [arbitrum, arbitrumSepolia],
})
