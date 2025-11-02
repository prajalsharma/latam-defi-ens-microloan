'use client';

import { useState } from 'react';

interface ENSRegistrationFormProps {
  availableNames: string[];
  onRegister: (name: string) => void;
}

export default function ENSRegistrationForm({ availableNames, onRegister }: ENSRegistrationFormProps) {
  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCustom, setUseCustom] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const nameToRegister = useCustom ? customName : selectedName;
      await onRegister(nameToRegister);
    } catch (error) {
      console.error('ENS registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Register ENS Identity</h2>
        <p className="text-gray-600 mt-1">Choose your .latam.eth subdomain</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Available Names */}
        {!useCustom && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Names
            </label>
            <div className="grid grid-cols-1 gap-2">
              {availableNames.map((name) => (
                <label key={name} className="relative flex items-center">
                  <input
                    type="radio"
                    name="ensName"
                    value={name}
                    checked={selectedName === name}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center justify-between w-full p-3 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${
                    selectedName === name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <span className="font-medium text-gray-900">{name}</span>
                    <span className="text-sm text-green-600 font-medium">Available</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Custom Name Toggle */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setUseCustom(!useCustom)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {useCustom ? 'Choose from available names' : 'Enter custom name'}
          </button>
        </div>

        {/* Custom Name Input */}
        {useCustom && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                className="block w-full py-3 px-4 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="yourname"
                pattern="[a-z0-9]+"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">.latam.eth</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Only lowercase letters and numbers allowed
            </p>
          </div>
        )}

        {/* Registration Fee */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Registration Fee</p>
              <p className="text-yellow-700">0.001 ETH (~$2) + gas fees</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || (!selectedName && !customName)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Registering...</span>
            </div>
          ) : (
            `Register ${useCustom ? customName || 'custom' : selectedName || 'selected'}.latam.eth`
          )}
        </button>
      </form>
    </div>
  );
}