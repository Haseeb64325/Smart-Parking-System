import React, { useState } from 'react';
import {
  X,
  Search,
  Car,
  LogIn,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { VehicleMovement } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  movements: VehicleMovement[];
  onSelectMovement: (movement: VehicleMovement) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  movements,
  onSelectMovement
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const matches = query.trim()
    ? movements.filter(
        (m) =>
          m.registration_number.toLowerCase().includes(query.toLowerCase()) ||
          (m.driver_name && m.driver_name.toLowerCase().includes(query.toLowerCase())) ||
          (m.space_label && m.space_label.toLowerCase().includes(query.toLowerCase()))
      )
    : movements.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            type="text"
            placeholder="Type vehicle plate, driver, or bay..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-bold bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none uppercase placeholder:normal-case font-mono-numbers"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Found ${matches.length} matches` : 'Recent Vehicles'}
          </div>

          {matches.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectMovement(item);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LicensePlateBadge plate={item.registration_number} size="sm" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {item.space_label ? `Bay ${item.space_label}` : 'North Lot'}
                  </span>
                  {item.driver_name && (
                    <span className="text-xs text-slate-400 ml-2">· {item.driver_name}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.parking_status === 'inside'
                      ? 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {item.parking_status === 'inside' ? 'Inside' : 'Exited'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}

          {matches.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No vehicles found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
