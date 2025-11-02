import { useState } from 'react'
import { useENSRegistrar } from '../lib/useContracts'

export default function ENSManager() {
  const [subdomain, setSubdomain] = useState('')
  const [addr, setAddr] = useState('')
  const { isSubdomainAvailable, registerSubdomain, updateSubdomainAddress } = useENSRegistrar()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Register ENS Subdomain</h2>
        <div className="space-y-4">
          <input
            className="input-field w-full"
            placeholder="Subdomain (e.g., juan)"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
          />
          <button className="btn-primary" onClick={() => registerSubdomain(subdomain)}>
            Register {subdomain}.latam.eth
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Update Address Record</h2>
        <div className="space-y-4">
          <input className="input-field w-full" placeholder="Subdomain (e.g., juan)" />
          <input
            className="input-field w-full"
            placeholder="New Address"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
          />
          <button className="btn-secondary" onClick={() => updateSubdomainAddress(subdomain, addr)}>
            Update Address
          </button>
        </div>
      </div>
    </div>
  )
}
