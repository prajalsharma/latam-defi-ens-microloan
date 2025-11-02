# LATAM DeFi: ENS Identity + Payments + Microloans on Arbitrum

A hackathon-ready, modular platform delivering ENS-based identity, payments, and microloans for underbanked users in Mexico and LATAM.

## Quickstart

### 1) Contracts (Foundry)
```
forge install openzeppelin/openzeppelin-contracts forge-std/forge-std
cp .env.example .env
forge build
```

Deploy to Arbitrum Sepolia:
```
export PRIVATE_KEY=...
export ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
export ARBISCAN_API_KEY=...
forge script script/Deploy.s.sol:Deploy --rpc-url $ARBITRUM_SEPOLIA_RPC --broadcast --verify -vvvv
```

### 2) Frontend (Next.js)
```
cd frontend
pnpm i
cp ../.env.example .env.local
pnpm dev
```

Set env:
```
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_REGISTRAR_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_USDC_ADDRESS=0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
```

## Architecture
- ENS subdomains as identity and payment handles
- MicroLoanVault handles deposits, loans, interest, and credit updates
- ENSSubdomainRegistrar mints subdomains and writes credit metadata to text records
- Arbitrum for low fees; USDC as stablecoin

## Tracks Alignment
- Arbitrum Innovation, ENS Subdomains, DeFi & New Economic Models, Finance & Payment Systems

## Demo Flow
1. Register subdomain (e.g., juan.latam.eth)
2. Verify user (owner-only for demo)
3. Request microloan tied to ENS node
4. Repay loan and see credit score update

## Notes
- ENS root node must be controlled (latam.eth demo uses placeholder)
- Use real ENS registry/resolver addresses per network
- Add Chainlink Automation or Superfluid for recurring payments (optional)
