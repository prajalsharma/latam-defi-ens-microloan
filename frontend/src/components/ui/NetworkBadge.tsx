'use client';

interface NetworkBadgeProps {
  chainId?: number;
}

const getNetworkInfo = (chainId?: number) => {
  switch (chainId) {
    case 421614:
      return {
        name: 'Arbitrum Sepolia',
        color: 'bg-blue-100 text-blue-800',
        dotColor: 'bg-blue-500'
      };
    case 42161:
      return {
        name: 'Arbitrum One',
        color: 'bg-green-100 text-green-800',
        dotColor: 'bg-green-500'
      };
    default:
      return {
        name: 'Unknown Network',
        color: 'bg-gray-100 text-gray-800',
        dotColor: 'bg-gray-500'
      };
  }
};

export default function NetworkBadge({ chainId }: NetworkBadgeProps) {
  const network = getNetworkInfo(chainId);
  
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${network.color}`}>
      <div className={`w-2 h-2 rounded-full ${network.dotColor}`} />
      <span>{network.name}</span>
    </div>
  );
}