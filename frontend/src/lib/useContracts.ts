import { Address, Hex, createPublicClient, createWalletClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import MicroLoanVault from '../../abi/MicroLoanVault.json'
import ENSSubdomainRegistrar from '../../abi/ENSSubdomainRegistrar.json'

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc'),
})

export function useMicroLoanVault() {
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address

  async function requestLoan(ensNode: Hex, amount: bigint) {
    // Implement with wallet client
  }
  async function repayLoan(ensNode: Hex) {}
  async function deposit(amount: bigint) {}
  async function withdraw(amount: bigint) {}
  async function getLoanDetails(ensNode: Hex) {}

  return { requestLoan, repayLoan, deposit, withdraw, getLoanDetails, loan: {} }
}

export function useENSRegistrar() {
  const registrar = process.env.NEXT_PUBLIC_REGISTRAR_ADDRESS as Address
  async function isSubdomainAvailable(subdomain: string) { return true }
  async function registerSubdomain(subdomain: string) {}
  async function updateSubdomainAddress(subdomain: string, addr: Address) {}
  return { isSubdomainAvailable, registerSubdomain, updateSubdomainAddress }
}
