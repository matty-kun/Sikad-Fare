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

  const handleCalculate = () => {
    calculateFare();
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      <div className="flex-grow flex flex-col overflow-y-auto pb-[260px]">
        {/* Top Mode Toggle */}
        <div className="p-4 pt-8">
          <ModeToggle mode={state.mode} onModeChange={setMode} />
        </div>

        {state.mode === 'route' ? (
          <div className="flex flex-col h-full">
            {/* Fare Display Area */}
            <div className="px-6 pb-3">
              <div className="text-right text-sm font-bold text-gray-500 uppercase tracking-wider">
                Sikad Fare
              </div>

              <div className="flex flex-col items-end justify-end mt-1">
                <div className="animate-fade-in">
                  <div className="flex flex-col items-end justify-end leading-none">
                    <div className="text-5xl font-bold text-gray-800 tracking-tight h-[60px] flex items-end">
                      {state.result
                        ? `₱${state.result.fare.toFixed(2)}`
                        : '₱0.00'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 h-[22px] flex items-center justify-end whitespace-nowrap">
                      {state.result ? (
                        typeof state.result.distance === 'number' ? (
                          `Distance: ${state.result.distance.toFixed(2)}km`
                        ) : (
                          `Distance: ${state.result.distance}`
                        )
                      ) : (
                        'Distance: 0.00 km'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spacer so content doesn't overlap fixed form */}
            <div className="flex-grow" />
          </div>
        ) : (
          <div className="p-4 pt-0 overflow-y-auto pb-[260px]">
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

      {/* History Button Above Form */}
      <div className="fixed bottom-[350px] left-2 z-30">
        <button
          onClick={() => toast('Coming soon!')}
          className="flex gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black"
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

      {/* Fixed Form Area Above Navbar */}
      <div className="fixed bottom-[70px] left-0 right-0 bg-gray-50 rounded-t-3xl p-5 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] border-t border-gray-200 z-20">
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
