'use client';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  action: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const IconComponent = ({ name, className }: { name: string; className: string }) => {
  const icons: Record<string, JSX.Element> = {
    banknotes: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H3.75zM3.75 6h-.75m0 0v.75c0 .414.336.75.75.75h.75m-.75-.75v.375c0 .621.504 1.125 1.125 1.125H4.5V6.75h.75m-.75 0v.75c0 .414.336.75.75.75H6V6h-.75M6 6h.75c.621 0 1.125.504 1.125 1.125V7.5H6V6z" />
      </svg>
    ),
    'trending-up': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 010 0L21.75 8.25M21.75 8.25l-5.25.75M21.75 8.25l-.75 5.25" />
      </svg>
    ),
    identification: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
    'paper-airplane': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    )
  };
  return icons[name] || icons.banknotes;
};

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200', 
      icon: 'text-green-600',
      button: 'bg-green-600 hover:bg-green-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      icon: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-600', 
      button: 'bg-orange-600 hover:bg-orange-700'
    }
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const colors = getColorClasses(action.color);
          return (
            <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover:shadow-md transition-shadow duration-200`}>
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 ${colors.button} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent name={action.icon} className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  <button 
                    onClick={action.action}
                    className={`mt-3 ${colors.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}