import { useState, useCallback } from 'react';
import { CalculatorState, CalculationMode, PassengerType, FareCalculation } from '../lib/types';
import { findRoute, normalizeName, midsayapProper } from '../lib/routeData';
import { getFareByGasPrice } from '../lib/fareCalculations';
import toast from 'react-hot-toast';

export function useFareCalculator() {
  const [state, setState] = useState<CalculatorState>({
    mode: 'route',
    origin: '',
    destination: '',
    gasPrice: 60,
    passengerType: 'student',
    hasBaggage: false,
    result: null,
  });

  const setMode = useCallback((mode: CalculationMode) => {
    setState(prev => ({ ...prev, mode, result: null }));
  }, []);

  const setOrigin = useCallback((origin: string) => {
    setState(prev => ({ ...prev, origin, destination: '' }));
  }, []);

  const setDestination = useCallback((destination: string) => {
    setState(prev => ({ ...prev, destination }));
  }, []);

  const setGasPrice = useCallback((gasPrice: number) => {
    setState(prev => ({ ...prev, gasPrice }));
  }, []);

  const setPassengerType = useCallback((passengerType: PassengerType) => {
    setState(prev => ({ ...prev, passengerType }));
  }, []);

  const setHasBaggage = useCallback((hasBaggage: boolean) => {
    setState(prev => ({ ...prev, hasBaggage }));
  }, []);

  const calculateFare = useCallback(() => {
    const { origin, destination, gasPrice, passengerType, hasBaggage } = state;

    // Validation
    if (!origin || !destination) {
      toast.error('Please select both origin and destination');
      setState(prev => ({ ...prev, result: null }));
      return;
    }

    if (origin === destination) {
      toast.error('Origin and destination cannot be the same');
      setState(prev => ({ ...prev, result: null }));
      return;
    }

    // Find route
    const route = findRoute(origin, destination);

    // Check if within town proper
    const isOriginProper = midsayapProper.includes(origin);
    const isDestProper = midsayapProper.includes(destination);

    if (!route && isOriginProper && isDestProper) {
      // Within town proper fare
      const withinTownFare = getFareByGasPrice(gasPrice, 15.00, 12.00, passengerType);
      const finalFare = hasBaggage ? withinTownFare + 10 : withinTownFare;

      const result: FareCalculation = {
        fare: finalFare,
        routeName: `${origin} → ${destination}`,
        distance: 'Within Town Proper',
        passengerType,
        gasPrice,
        hasBaggage
      };

      setState(prev => ({ ...prev, result }));
      return;
    }

    if (!route) {
      toast.error('Route not found. Please use Map mode for custom routes.');
      setState(prev => ({ ...prev, result: null }));
      return;
    }

    // Calculate fare
    let fare = getFareByGasPrice(gasPrice, route.baseRegular, route.baseStudent, passengerType);
    
    if (hasBaggage) {
      fare += 10;
    }

    const result: FareCalculation = {
      fare,
      routeName: `${normalizeName(origin)} → ${normalizeName(destination)}`,
      distance: route.distance,
      passengerType,
      gasPrice,
      hasBaggage
    };

    setState(prev => ({ ...prev, result }));
  }, [state]);

  const setMapResult = useCallback((result: FareCalculation) => {
    setState(prev => ({ ...prev, result }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      origin: '',
      destination: '',
      gasPrice: 60,
      passengerType: 'student',
      hasBaggage: false,
      result: null,
    }));
  }, []);

  return {
    state,
    setMode,
    setOrigin,
    setDestination,
    setGasPrice,
    setPassengerType,
    setHasBaggage,
    calculateFare,
    setMapResult,
    reset
  };
}