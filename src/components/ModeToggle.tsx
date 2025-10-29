import { CalculationMode } from '../lib/types';

interface ModeToggleProps {
  mode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="relative bg-gray-100 rounded-full p-1 grid grid-cols-2 gap-1 mb-6">
      {/* Background slider */}
      <div
        className={`absolute top-1 bottom-1 bg-white rounded-full shadow-md transition-all duration-300 ease-out ${ 
          mode === 'route' ? 'left-1 right-[50%]' : 'left-[50%] right-1'
        }`}
      />
      
      {/* Buttons */}
      <button
        onClick={() => onModeChange('route')}
        className={`relative z-10 py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 ${ 
          mode === 'route'
            ? 'text-black'
            : 'text-gray-500'
        }`}
      >
        📍 Route
      </button>
      <button
        onClick={() => onModeChange('map')}
        className={`relative z-10 py-3 px-4 rounded-full font-bold text-sm transition-all duration-300 ${ 
          mode === 'map'
            ? 'text-black'
            : 'text-gray-500'
        }`}
      >
        🗺️ Map
      </button>
    </div>
  );
}