'use client';

import dynamic from 'next/dynamic';
import { useFareCalculator } from '../hooks/useFareCalculator';
import Header from './Header';
import ModeToggle from './ModeToggle';
import RouteMode from './RouteMode';
import FareResult from './FareResult';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-safe">
        <div className="bg-white min-h-screen">
          <Header />
          
          <div className="p-5 pb-8">
            <ModeToggle mode={state.mode} onModeChange={setMode} />

            {state.mode === 'route' ? (
              <>
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
                />

                <div className="mt-6 space-y-3">
                  <button
                    onClick={calculateFare}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-black/20"
                  >
                    Calculate Fare
                  </button>
                  <button
                    onClick={reset}
                    className="w-full py-4 bg-transparent text-gray-500 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all"
                  >
                    Reset
                  </button>
                </div>
              </>
            ) : (
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
            )}

            {state.error && (
              <div className="mt-5 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm font-semibold animate-slide-up flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <span className="flex-1">{state.error}</span>
              </div>
            )}

            {state.result && <FareResult result={state.result} />}
          </div>
        </div>
      </div>
    </div>
  );
}