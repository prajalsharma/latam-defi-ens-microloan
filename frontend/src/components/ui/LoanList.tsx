'use client';

import { formatDistanceToNow } from 'date-fns';

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  status: 'active' | 'repaid' | 'overdue';
  borrower: string;
  ensName?: string;
  startDate: Date;
  dueDate: Date;
  amountDue: number;
}

interface LoanListProps {
  loans: Loan[];
  title: string;
  showActions?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Active</span>;
    case 'repaid':
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Repaid</span>;
    case 'overdue':
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>;
    default:
      return null;
  }
};

export default function LoanList({ loans, title, showActions = false }: LoanListProps) {
  if (loans.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No loans found</h3>
          <p className="text-gray-600">You don't have any loans matching this criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {loans.map((loan) => (
          <div key={loan.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {loan.ensName ? loan.ensName.slice(0, 2).toUpperCase() : loan.borrower.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {loan.ensName || `${loan.borrower.slice(0, 6)}...${loan.borrower.slice(-4)}`}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Started {formatDistanceToNow(loan.startDate, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${loan.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{loan.interestRate}% rate</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {loan.status === 'active' ? `$${loan.amountDue.toLocaleString()}` : '-'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {loan.status === 'active' ? `Due ${formatDistanceToNow(loan.dueDate, { addSuffix: true })}` : 'Completed'}
                  </p>
                </div>
                
                <div>
                  {getStatusBadge(loan.status)}
                </div>
              </div>
            </div>
            
            {showActions && loan.status === 'active' && (
              <div className="mt-4 flex items-center justify-end space-x-3">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Details
                </button>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200">
                  Repay ${loan.amountDue.toLocaleString()}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}