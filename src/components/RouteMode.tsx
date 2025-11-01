import { midsayapProper, outsideMidsayap } from '../lib/routeData';
import { PassengerType } from '../lib/types';
import GasPriceSelector from './GasPriceSelector';
import LocationSelector from './LocationSelector';
import PassengerSelector from './PassengerSelector';
import BaggageSelector from './BaggageSelector';
import ActionButtons from './ActionButtons';
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
  onPassengerTypeChange: (type: Partial<PassengerType>) => void;
  onBaggageChange: (hasBaggage: boolean) => void;
  onCalculate: () => void;
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
  onCalculate,
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
        ...outsideMidsayap,
      ];
    }
    return [];
  };

  const availableDestinations = getAvailableDestinations();

  return (
    <div className="flex flex-col h-full">
      {/* Inputs Area */}
      <div className="grid grid-cols-2 gap-6 flex-grow">
        {/* Left Column */}
        <div className="space-y-4">
          <LocationSelector
            label="From"
            icon="📍"
            value={origin}
            onChange={onOriginChange}
            options={[...midsayapProper, ...outsideMidsayap]}
            placeholder="Select starting point..."
          />

          <GasPriceSelector gasPrice={gasPrice} onChange={onGasPriceChange} />

          <PassengerSelector
            passengerType={passengerType}
            onChange={onPassengerTypeChange}
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col space-y-4">
          <LocationSelector
            label="To"
            icon="🎯"
            value={destination}
            onChange={onDestinationChange}
            options={availableDestinations}
            placeholder="Select destination..."
            disabled={!origin}
          />

          <BaggageSelector
            hasBaggage={hasBaggage}
            onChange={onBaggageChange}
          />
          {/* Calculate Button Area */}
          <div className="mt-auto">
            <ActionButtons
              onCalculate={onCalculate}
              isCalculateDisabled={!origin || !destination}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
