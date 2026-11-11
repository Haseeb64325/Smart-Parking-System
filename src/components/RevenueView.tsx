import React, { useState } from 'react';
import {
  CircleDollarSign,
  Receipt,
  CreditCard,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Car
} from 'lucide-react';
import { VehicleMovement } from '../types';
import { HOURLY_RATE, DAILY_MAX_RATE, calculateFee, formatDuration } from '../data/mockData';
import { LicensePlateBadge } from './LicensePlateBadge';

interface RevenueViewProps {
  movements: VehicleMovement[];
  onSelectMovement: (movement: VehicleMovement) => void;
}

export const RevenueView: React.FC<RevenueViewProps> = ({ movements, onSelectMovement }) => {
  const [ratePerHour, setRatePerHour] = useState(HOURLY_RATE);
  const [calcHours, setCalcHours] = useState(3);

  const completedExits = movements.filter((m) => m.parking_status === 'exited');
  const activeInside = movements.filter((m) => m.parking_status === 'inside');

  // Total collected revenue
  const totalCollected = completedExits.reduce((acc, curr) => acc + (curr.fee || 7.00), 0);

  // Active accrued revenue from cars currently parked
  const activeAccrued = activeInside.reduce((acc, curr) => {
    return acc + calculateFee(curr.entry_at);
  }, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Revenue Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Revenue & Tariff Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated parking fee calculation, daily collection receipts, and tariff configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold">
            Standard: ${ratePerHour.toFixed(2)}/hour
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Collected
            </span>
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            ${totalCollected.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            From {completedExits.length} paid exit check-outs
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Accruing Revenue
            </span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono-numbers">
            ${activeAccrued.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accrued across {activeInside.length} currently parked vehicles
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Average Fee / Vehicle
            </span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mono-numbers">
            ${(totalCollected / Math.max(1, completedExits.length)).toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Based on ~2.1 hrs average stay
          </p>
        </div>
      </div>

      {/* Tariff Calculator & Recent Paid Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Tariff Simulator (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tariff & Pricing Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimate customer parking fee by planned parking duration
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Parking Duration: {calcHours} {calcHours === 1 ? 'Hour' : 'Hours'}
              </label>
              <input
                type="range"
                min="1"
                max="24"
                value={calcHours}
                onChange={(e) => setCalcHours(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono-numbers">
                <span>1h ($3.50)</span>
                <span>8h ($28.00 cap)</span>
                <span>24h ($28.00)</span>
              </div>
            </div>

            {/* Calculated Fee Hero Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Estimated Total Fee</span>
                <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 font-mono-numbers">
                  ${Math.min(calcHours * ratePerHour, DAILY_MAX_RATE).toFixed(2)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <p>Base Rate: ${ratePerHour.toFixed(2)}/hr</p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                  Max Daily Cap: ${DAILY_MAX_RATE.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Tariff Policy:</div>
              <p>• First 15 minutes: Grace drop-off period ($0.00)</p>
              <p>• EV Charging stalls: Complimentary with parking session</p>
              <p>• Automatic receipt generated upon barrier exit</p>
            </div>
          </div>
        </div>

        {/* Recent Payment Receipts (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Completed Parking Transactions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified gate exit transactions and billed amounts
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
            {completedExits.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectMovement(item)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <LicensePlateBadge plate={item.registration_number} size="sm" />
                      <span className="text-xs font-medium text-slate-500">
                        {item.space_label ? `Bay ${item.space_label}` : 'North lot'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.duration_minutes ? formatDuration(item.duration_minutes) : 'Session completed'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-mono-numbers font-bold text-slate-900 dark:text-white">
                    ${(item.fee || 7.00).toFixed(2)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                    <CheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
