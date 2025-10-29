import { gasPriceOptions } from '../lib/routeData';
import { useState } from 'react';

interface GasPriceSelectorProps {
  gasPrice: number;
  onChange: (price: number) => void;
}

export default function GasPriceSelector({ gasPrice, onChange }: GasPriceSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const currentOption = gasPriceOptions.find(opt => opt.value === gasPrice);
  const displayText = currentOption?.label || '₱51–60';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
    setIsEditing(false);
  };

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
        <span>⛽</span> Gas Price
      </label>
      
      {!isEditing ? (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform">
          <div>
            <div className="text-xs text-gray-500 font-semibold mb-1">Current Price</div>
            <div className="text-2xl font-black text-gray-900">{displayText}</div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            Change
          </button>
        </div>
      ) : (
        <select
          value={gasPrice}
          onChange={handleChange}
          className="w-full p-4 text-lg font-semibold border-2 border-gray-200 rounded-2xl bg-gray-50 appearance-none focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all"
        >
          {gasPriceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      <p className="text-xs text-gray-500 mt-2 ml-1">
        💡 Select based on the most expensive station
      </p>
    </div>
  );
}