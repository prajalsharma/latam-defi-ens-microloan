import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { formatEther, parseUnits } from 'viem'
import { useMicroLoanVault } from '../lib/useContracts'

export default function LoanDashboard() {
  const { address } = useAccount()
  const [amount, setAmount] = useState('50')
  const [ensNode, setEnsNode] = useState('')

  const { requestLoan, repayLoan, getLoanDetails, loan } = useMicroLoanVault()

  useEffect(() => {
    if (ensNode) getLoanDetails(ensNode)
  }, [ensNode])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="card lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Request Microloan</h2>
        <div className="space-y-4">
          <input
            className="input-field w-full"
            placeholder="ENS node (bytes32)"
            value={ensNode}
            onChange={(e) => setEnsNode(e.target.value)}
          />
          <input
            className="input-field w-full"
            placeholder="Amount (USDC)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => requestLoan(ensNode, parseUnits(amount, 6))}
          >
            Request {amount} USDC
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Loan Status</h2>
        <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto">
{JSON.stringify(loan, null, 2)}
        </pre>
        <button
          className="btn-secondary mt-4"
          onClick={() => repayLoan(ensNode)}
        >
          Repay Loan
        </button>
      </div>
    </div>
  )
}
