import { useState } from 'react'
import { useMicroLoanVault } from '../lib/useContracts'
import { parseUnits } from 'viem'

export default function DepositInterface() {
  const [amount, setAmount] = useState('100')
  const { deposit, withdraw } = useMicroLoanVault()

  return (
    <div className="card max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Earn by Depositing USDC</h2>
      <div className="space-y-4">
        <input
          className="input-field w-full"
          placeholder="Amount (USDC)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex gap-4">
          <button className="btn-primary" onClick={() => deposit(parseUnits(amount, 6))}>
            Deposit
          </button>
          <button className="btn-secondary" onClick={() => withdraw(parseUnits(amount, 6))}>
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}
