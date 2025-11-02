'use client';

interface Loan {
  id: string;
  amount: number;
  status: 'active' | 'repaid' | 'overdue';
}

interface LoanStatsProps {
  loans: Loan[];
}

export default function LoanStats({ loans }: LoanStatsProps) {
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const repaidLoans = loans.filter(loan => loan.status === 'repaid');
  const overdueLoans = loans.filter(loan => loan.status === 'overdue');
  
  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeBorrowed = activeLoans.reduce((sum, loan) => sum + loan.amount, 0);

  const stats = [
    {
      label: 'Total Borrowed',
      value: `$${totalBorrowed.toLocaleString()}`,
      color: 'text-blue-600'
    },
    {
      label: 'Active',
      value: activeLoans.length.toString(),
      color: 'text-orange-600'
    },
    {
      label: 'Repaid',
      value: repaidLoans.length.toString(),
      color: 'text-green-600'
    },
    {
      label: 'Overdue',
      value: overdueLoans.length.toString(),
      color: overdueLoans.length > 0 ? 'text-red-600' : 'text-gray-400'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}