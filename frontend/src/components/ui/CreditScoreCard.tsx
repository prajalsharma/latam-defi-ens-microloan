'use client';

interface CreditScoreCardProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

const getCreditRating = (score: number) => {
  if (score >= 750) return { rating: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  if (score >= 700) return { rating: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
  if (score >= 650) return { rating: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
  return { rating: 'Poor', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
};

export default function CreditScoreCard({ score, trend, lastUpdated }: CreditScoreCardProps) {
  const creditInfo = getCreditRating(score);
  const scorePercentage = ((score - 300) / (850 - 300)) * 100;

  return (
    <div className={`bg-white rounded-xl border p-6 ${creditInfo.borderColor}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Credit Score</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${creditInfo.bgColor} ${creditInfo.color}`}>
          {creditInfo.rating}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">{score}</div>
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
          {trend === 'up' && (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {trend === 'down' && (
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>Updated {lastUpdated.toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Score Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>300</span>
          <span>850</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${creditInfo.color.replace('text-', 'bg-')}`}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
        <div className="grid grid-cols-4 text-xs text-gray-500 mt-1">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          <p>Your credit score affects loan rates:</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span className="font-medium">{score >= 750 ? '2.0%' : score >= 700 ? '2.5%' : score >= 650 ? '3.0%' : '4.0%'}/month</span>
            </div>
            <div className="flex justify-between">
              <span>Max Loan:</span>
              <span className="font-medium">$1,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}