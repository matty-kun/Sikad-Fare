'use client';

import { gasPriceOptions } from '../lib/routeData';
import { useState } from 'react';

interface GasPriceSelectorProps {
  gasPrice: number;
  onChange: (price: number) => void;
}

export default function GasPriceSelector({ gasPrice, onChange }: GasPriceSelectorProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-xs font-bold text-gray-600">
        <span>⛽</span> Gas Price
        <div className="relative flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
            onClick={() => setIsTooltipVisible(!isTooltipVisible)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div
            id="tooltip-gas-price"
            role="tooltip"
            className={`absolute z-10 inline-block px-4 py-3 text-sm font-semibold text-gray-800 transition-opacity duration-300 bg-white rounded-xl shadow-lg border border-gray-200 w-48 -top-2 left-full ml-3 ${
              isTooltipVisible ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          >
            Select based on the most expensive station
            <div className="absolute w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45 -left-1.5 top-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </label>
      
      <select
        value={gasPrice}
        onChange={handleChange}
        className="w-full p-2 text-xs font-semibold border-2 border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all"
      >
        {gasPriceOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}