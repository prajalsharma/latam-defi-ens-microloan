'use client';

import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToasterProps {
  toasts?: Toast[];
}

const toastTypes = {
  success: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    classes: 'bg-green-50 border-green-200 text-green-800'
  },
  error: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    classes: 'bg-red-50 border-red-200 text-red-800'
  },
  info: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    classes: 'bg-blue-50 border-blue-200 text-blue-800'
  },
  warning: {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  }
};

export default function Toaster({ toasts = [] }: ToasterProps) {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    setVisibleToasts(toasts);
  }, [toasts]);

  const removeToast = (id: string) => {
    setVisibleToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {visibleToasts.map((toast) => {
        const config = toastTypes[toast.type];
        return (
          <div
            key={toast.id}
            className={`max-w-sm w-full ${config.classes} border rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {config.icon}
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="mt-1 text-sm opacity-90">{toast.message}</p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                  onClick={() => removeToast(toast.id)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}