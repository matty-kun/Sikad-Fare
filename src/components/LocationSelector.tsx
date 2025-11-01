'use client';

import { midsayapProper, outsideMidsayap } from '../lib/routeData';

interface LocationSelectorProps {
  label: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}

export default function LocationSelector({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: LocationSelectorProps) {
  const withinTownOptions = options.filter(p => midsayapProper.includes(p));
  const outsideTownOptions = options.filter(p => outsideMidsayap.includes(p));

  return (
    <div>
      <label className="text-xs font-bold text-gray-600 mb-1 flex items-center gap-1">
        <span className="text-md">{icon}</span> {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full p-2 text-xs font-semibold border-2 border-gray-200 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">{placeholder}</option>
          {withinTownOptions.length > 0 && <optgroup label="🏘️ Within Town">{withinTownOptions.map(p => <option key={p} value={p}>{p}</option>)}</optgroup>}
          {outsideTownOptions.length > 0 && <optgroup label="🌄 Outside Town">{outsideTownOptions.map(p => <option key={p} value={p}>{p}</option>)}</optgroup>}
        </select>
      </div>
    </div>
  );
}