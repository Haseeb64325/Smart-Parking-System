import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Car,
  PieChart,
  ArrowRight,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ParkingSpace, VehicleMovement } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';
import { formatDuration } from '../data/mockData';

interface ActivityViewProps {
  spaces: ParkingSpace[];
  movements: VehicleMovement[];
  onSelectMovement: (movement: VehicleMovement) => void;
  onOpenRecordMovement: () => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  spaces,
  movements,
  onSelectMovement,
  onOpenRecordMovement
}) => {
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const now = new Date();
  const startTime = new Date(now);
  if (period === 'Daily') startTime.setHours(0, 0, 0, 0);
  if (period === 'Weekly') startTime.setDate(now.getDate() - 7);
  if (period === 'Monthly') startTime.setMonth(now.getMonth() - 1);

  const periodMovements = movements.filter((item) => {
    const entryTime = new Date(item.entry_at).getTime();
    const exitTime = item.exit_at ? new Date(item.exit_at).getTime() : 0;
    return entryTime >= startTime.getTime() || exitTime >= startTime.getTime();
  });

  const totalMovementsCount = periodMovements.reduce((acc, item) => {
    const entered = new Date(item.entry_at).getTime() >= startTime.getTime() ? 1 : 0;
    const exited = item.exit_at && new Date(item.exit_at).getTime() >= startTime.getTime() ? 1 : 0;
    return acc + entered + exited;
  }, 0);

  const totalSpaces = spaces.length;
  const occupiedCount = spaces.filter((s) => s.space_status === 'occupied').length;
  const utilizationPercent = totalSpaces > 0 ? Math.round((occupiedCount / totalSpaces) * 100) : 0;

  // Peak hours calculation across buckets
  const hours = [6, 8, 10, 12, 14, 16, 18, 20];

  const entriesPerBucket = hours.map((hour) => {
    return periodMovements.filter((m) => {
      const d = new Date(m.entry_at);
      const h = d.getHours();
      return h >= hour && h < hour + 2 && d >= startTime;
    }).length;
  });

  const exitsPerBucket = hours.map((hour) => {
    return periodMovements.filter((m) => {
      if (!m.exit_at) return false;
      const d = new Date(m.exit_at);
      const h = d.getHours();
      return h >= hour && h < hour + 2 && d >= startTime;
    }).length;
  });

  const peakMax = Math.max(1, ...entriesPerBucket, ...exitsPerBucket);

  // Average stay calculation
  const completedStays = periodMovements.filter((m) => m.duration_minutes !== undefined && m.duration_minutes > 0);
  const avgDuration =
    completedStays.length > 0
      ? Math.round(
          completedStays.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) /
            completedStays.length
        )
      : 110;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Period Switcher */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Activity, peak hours, and utilization calculated from your vehicle records.
          </p>
        </div>

        {/* Segmented Period Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
          {(['Daily', 'Weekly', 'Monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === tab
                  ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Movements Count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Vehicle Movements
            </span>
            <TrendingUp className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {totalMovementsCount}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recorded in selected {period.toLowerCase()} period
          </p>
        </div>

        {/* Current Occupancy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Current Occupancy
            </span>
            <PieChart className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {occupiedCount} / {totalSpaces}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            North Lot parking bays currently in use
          </p>
        </div>

        {/* Average Duration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
              Avg. Turnaround Time
            </span>
            <Clock className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {formatDuration(avgDuration)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Average customer parking duration
          </p>
        </div>
      </div>

      {/* Main Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Parking Hours Dual Bar Chart (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Peak Parking Inflow & Outflow Hours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inbound entry vs outbound exit distribution across 2-hour intervals
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-gradient-to-t from-teal-500 to-teal-400" />
                <span className="text-slate-600 dark:text-slate-400">Entries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-gradient-to-t from-indigo-600 to-purple-600" />
                <span className="text-slate-600 dark:text-slate-400">Exits</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="mt-8">
            <div className="h-52 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              {hours.map((hour, idx) => {
                const entryVal = entriesPerBucket[idx];
                const exitVal = exitsPerBucket[idx];
                const entryHeight = Math.max(8, Math.round((entryVal / peakMax) * 160));
                const exitHeight = Math.max(8, Math.round((exitVal / peakMax) * 160));
                const isHovered = hoveredHour === hour;

                return (
                  <div
                    key={hour}
                    onMouseEnter={() => setHoveredHour(hour)}
                    onMouseLeave={() => setHoveredHour(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-mono-numbers whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
                        <span>{hour}:00 · {entryVal} In / {exitVal} Out</span>
                      </div>
                    )}

                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Entry Bar (Teal) */}
                      <div
                        className="w-1/2 max-w-[18px] rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400 transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${entryHeight}px` }}
                      />
                      {/* Exit Bar (Indigo/Purple) */}
                      <div
                        className="w-1/2 max-w-[18px] rounded-t-md bg-gradient-to-t from-indigo-700 to-purple-500 transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${exitHeight}px` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hour Labels */}
            <div className="flex justify-between items-center mt-3 px-1 text-[11px] font-mono-numbers font-semibold text-slate-400">
              {hours.map((hour) => (
                <span key={hour} className="flex-1 text-center">
                  {hour.toString().padStart(2, '0')}:00
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Utilization Card (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              North Lot Utilization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current facility capacity profile
            </p>

            <div className="mt-6 flex flex-col items-center text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-teal-500 transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - utilizationPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
                    {utilizationPercent}%
                  </span>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    Load
                  </span>
                </div>
              </div>

              <div className="w-full mt-6 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Occupied Bays</span>
                  <span className="font-mono-numbers font-bold text-slate-900 dark:text-white">
                    {occupiedCount}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Free Bays</span>
                  <span className="font-mono-numbers font-bold text-teal-600 dark:text-teal-400">
                    {totalSpaces - occupiedCount}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Peak Inflow Hour</span>
                  <span className="font-mono-numbers font-bold text-indigo-600 dark:text-indigo-400">
                    10:00 - 12:00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenRecordMovement}
            className="w-full mt-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
          >
            Record New Vehicle Entry
          </button>
        </div>
      </div>

      {/* Latest Movement Log for the period */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Latest Movements in this Period
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing recent vehicle records for {period.toLowerCase()} analytics
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
          {periodMovements.slice(0, 5).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMovement(item)}
              className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LicensePlateBadge plate={item.registration_number} size="sm" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.space_label ? `Bay ${item.space_label}` : 'North Lot'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono-numbers text-slate-600 dark:text-slate-400">
                  {new Date(item.exit_at || item.entry_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.parking_status === 'inside'
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.parking_status === 'inside' ? 'Inside' : 'Exited'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
