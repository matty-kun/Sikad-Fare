'use client';

import { midsayapProper, outsideMidsayap } from '../lib/routeData';
import { PassengerType } from '../lib/types';
import GasPriceSelector from './GasPriceSelector';
import toast from 'react-hot-toast';

interface RouteModeProps {
  origin: string;
  destination: string;
  gasPrice: number;
  passengerType: PassengerType;
  hasBaggage: boolean;
  onOriginChange: (origin: string) => void;
  onDestinationChange: (destination: string) => void;
  onGasPriceChange: (price: number) => void;
  onPassengerTypeChange: (type: PassengerType) => void;
  onBaggageChange: (hasBaggage: boolean) => void;
}

export default function RouteMode({
  origin,
  destination,
  gasPrice,
  passengerType,
  hasBaggage,
  onOriginChange,
  onDestinationChange,
  onGasPriceChange,
  onPassengerTypeChange,
  onBaggageChange,
}: RouteModeProps) {
  const getAvailableDestinations = () => {
    if (!origin) return [];
    const isOriginProper = midsayapProper.includes(origin);
    const isOriginOutside = outsideMidsayap.includes(origin);
    
    if (isOriginOutside) {
      return midsayapProper;
    } else if (isOriginProper) {
      return [
        ...midsayapProper.filter(place => place !== origin),
        ...outsideMidsayap
      ];
    }
    return [];
  };

  const availableDestinations = getAvailableDestinations();

    return (
      <div className="space-y-5 pt-4">
        {/* Origin */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-lg">📍</span> From
          </label>
          <div className="relative">
            <select
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="w-full p-4 pl-5 text-base font-semibold border-2 border-gray-200 rounded-2xl bg-gray-50 appearance-none focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all"
            >
              <option value="">Select starting point...</option>
              <optgroup label="🏘️ Within Town">
                {midsayapProper.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌄 Outside Town">
                {outsideMidsayap.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
  
        {/* Destination */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-lg">🎯</span> To
          </label>
          <div className="relative">
            <select
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              disabled={!origin}
              className="w-full p-4 pl-5 text-base font-semibold border-2 border-gray-200 rounded-2xl bg-gray-50 appearance-none focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select destination...</option>
              {availableDestinations.length > 0 && (
                <>
                  {midsayapProper.some(p => availableDestinations.includes(p)) && (
                    <optgroup label="🏘️ Within Town">
                      {availableDestinations
                        .filter(p => midsayapProper.includes(p))
                        .map((place) => (
                          <option key={place} value={place}>
                            {place}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {outsideMidsayap.some(p => availableDestinations.includes(p)) && (
                    <optgroup label="🌄 Outside Town">
                      {availableDestinations
                        .filter(p => outsideMidsayap.includes(p))
                        .map((place) => (
                          <option key={place} value={place}>
                            {place}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </>
              )}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
  
        {/* Gas Price */}
        <GasPriceSelector gasPrice={gasPrice} onChange={onGasPriceChange} />
  
        {/* Passenger Type */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-lg">👤</span> Passenger
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onPassengerTypeChange('student')}
              className={`p-4 rounded-2xl font-bold text-sm transition-all border-2 active:scale-95 ${ 
                passengerType === 'student'
                  ? 'bg-black text-white border-black shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">🎓</div>
              <div className="text-xs">Student/PWD/Senior</div>
            </button>
            <button
              type="button"
              onClick={() => onPassengerTypeChange('regular')}
              className={`p-4 rounded-2xl font-bold text-sm transition-all border-2 active:scale-95 ${ 
                passengerType === 'regular'
                  ? 'bg-black text-white border-black shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">👔</div>
              <div className="text-xs">Regular</div>
            </button>
          </div>
        </div>
  
        {/* Baggage */}
        <label className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 transition-all active:scale-[0.98]">
          <input
            type="checkbox"
            checked={hasBaggage}
            onChange={(e) => onBaggageChange(e.target.checked)}
            className="w-6 h-6 accent-black cursor-pointer rounded-lg"
          />
          <div className="flex-1">
            <div className="font-bold text-gray-900 flex items-center gap-2">
              <span>🎒</span> Baggage
            </div>
            <div className="text-xs text-gray-600 mt-0.5">Add ₱10.00 fee</div>
          </div>
        </label>
      </div>  );
}