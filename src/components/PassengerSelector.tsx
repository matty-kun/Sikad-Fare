'use client';

import { PassengerType } from '../lib/types';

interface PassengerSelectorProps {
  passengerType: PassengerType;
  onChange: (type: Partial<PassengerType>) => void;
}

export default function PassengerSelector({ passengerType, onChange }: PassengerSelectorProps) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
        <span className="text-md">👤</span> Passenger
      </label>
      <div className="grid grid-cols-3 gap-2">
        <input
          type="number"
          min="1"
          value={passengerType.quantity}
          onChange={(e) => onChange({ quantity: parseInt(e.target.value) || 1 })}
          className="w-full p-2 text-center text-sm font-semibold border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all col-span-1 h-12"
        />
        <div className="relative col-span-2">
          <select
            value={passengerType.type}
            onChange={(e) => onChange({ type: e.target.value as 'student' | 'regular' })}
            className="w-full p-2 text-left text-sm font-semibold border-2 border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all h-12"
          >
            <option value="student">🎓 Student</option>
            <option value="student">♿ PWD</option>
            <option value="student">👵 Senior</option>
            <option value="regular">👤 Regular</option>
          </select>
        </div>
      </div>
    </div>
  );
}