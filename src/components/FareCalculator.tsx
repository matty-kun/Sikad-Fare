'use client';

import dynamic from 'next/dynamic';
import { useFareCalculator } from '../hooks/useFareCalculator';
import RouteMode from './RouteMode';
import FareResult from './FareResult';
import BottomNavbar from './BottomNavbar';
import ModeToggle from './ModeToggle';
import toast from 'react-hot-toast';

const MapMode = dynamic(() => import('./MapMode'), {
  ssr: false,
});

export default function FareCalculator() {
  const {
    state,
    setMode,
    setOrigin,
    setDestination,
    setGasPrice,
    setPassengerType,
    setHasBaggage,
    calculateFare,
    setMapResult,
    setError,
    reset
  } = useFareCalculator();
  
  // Collapse the sheet to peek state after calculation
  const handleCalculate = () => {
    calculateFare();
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Mode Toggle */}
        <div className="p-4 pt-8">
          <ModeToggle mode={state.mode} onModeChange={setMode} />
        </div>

        {state.mode === 'route' ? (
          <div className="flex flex-col h-full">
            {/* Calculator Display Area */}
            <div className="p-6 pb-3"> {/* added smaller bottom padding */}
              <div className="text-right text-sm font-bold text-gray-500 uppercase tracking-wider">
                Sikad Fare
              </div>
              <div className="grid grid-cols-2 items-end mt-1"> {/* nudged history button lower */}
                <div className="flex items-end h-full">
                  <button
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors mt-[-10px]"
                    onClick={() => toast('Coming soon!')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>History</span>
                  </button>
                </div>
                <div className="text-right">
                  <div className="animate-fade-in">
                    <div className="text-5xl font-bold text-gray-800 tracking-tight min-h-[60px] flex items-end justify-end">
                      {state.result
                        ? `₱${state.result.fare.toFixed(2)}`
                        : '₱0.00'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 min-h-[20px] whitespace-nowrap">
                      {state.result ? (
                        typeof state.result.distance === 'number' ? (
                          `Distance: ${state.result.distance.toFixed(2)}km`
                        ) : (
                          `Distance: ${state.result.distance}`
                        )
                      ) : (
                        'Distance: 0.00km'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-grow bg-gray-50 rounded-t-3xl p-5 pb-8 mt-3 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] border-t border-gray-200">
              <RouteMode
                origin={state.origin}
                destination={state.destination}
                gasPrice={state.gasPrice}
                passengerType={state.passengerType}
                hasBaggage={state.hasBaggage}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
                onGasPriceChange={setGasPrice}
                onPassengerTypeChange={setPassengerType}
                onBaggageChange={setHasBaggage}
                onCalculate={handleCalculate}
              />
            </div>
          </div>
        ) : (
          <div className="p-4 pt-0 overflow-y-auto">
            <MapMode
              gasPrice={state.gasPrice}
              passengerType={state.passengerType}
              hasBaggage={state.hasBaggage}
              onGasPriceChange={setGasPrice}
              onPassengerTypeChange={setPassengerType}
              onBaggageChange={setHasBaggage}
              onCalculate={setMapResult}
              onError={setError}
            />
            {state.result && (
              <div className="mt-4">
                <FareResult result={state.result} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavbar
        activeItem="calculator"
        onItemClick={(item) => {
          if (item !== 'calculator') toast('Coming soon!');
        }}
      />
    </div>
  );
}
