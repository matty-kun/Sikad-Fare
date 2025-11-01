'use client';

interface ActionButtonsProps {
  onCalculate: () => void;
  isCalculateDisabled?: boolean;
}

export default function ActionButtons({ onCalculate, isCalculateDisabled = false }: ActionButtonsProps) {
  return (
    <div className="mt-auto space-y-2 pt-2">
      <button
        onClick={onCalculate}
        disabled={isCalculateDisabled}
        className="w-full py-5 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md shadow-black/20 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Calculate Fare
      </button>
    </div>
  );
}