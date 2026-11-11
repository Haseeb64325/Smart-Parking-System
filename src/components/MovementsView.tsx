import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Car,
  LogIn,
  LogOut,
  Clock,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VehicleMovement } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';
import { formatDuration } from '../data/mockData';

interface MovementsViewProps {
  movements: VehicleMovement[];
  onSelectMovement: (movement: VehicleMovement) => void;
  onOpenRecordMovement: () => void;
  onCheckOutVehicle: (movement: VehicleMovement) => void;
}

export const MovementsView: React.FC<MovementsViewProps> = ({
  movements,
  onSelectMovement,
  onOpenRecordMovement,
  onCheckOutVehicle
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Inside' | 'Exited'>('All');
  const [newestFirst, setNewestFirst] = useState(true);

  const filtered = movements
    .filter((item) => {
      const plate = item.registration_number.toLowerCase();
      const driver = (item.driver_name || '').toLowerCase();
      const bay = (item.space_label || '').toLowerCase();
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || plate.includes(q) || driver.includes(q) || bay.includes(q);

      const matchesStatus =
        filter === 'All' ||
        (filter === 'Inside' && item.parking_status === 'inside') ||
        (filter === 'Exited' && item.parking_status === 'exited');

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.exit_at || a.entry_at).getTime();
      const timeB = new Date(b.exit_at || b.entry_at).getTime();
      return newestFirst ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* View Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vehicle Management & Movement Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search registrations and review complete real-time North Lot parking history.
          </p>
        </div>

        <button
          onClick={onOpenRecordMovement}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Movement</span>
        </button>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search registration number or driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono-numbers uppercase placeholder:normal-case"
          />
        </div>

        {/* Filter and Sort Group */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Status Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['All', 'Inside', 'Exited'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setNewestFirst(!newestFirst)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
            <span>{newestFirst ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Movements Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {search ? 'Search Results' : 'Vehicle Movement Records'}
          </span>
          <span className="font-mono-numbers">{filtered.length} total</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isInside = item.parking_status === 'inside';
              const eventDate = new Date(item.exit_at || item.entry_at);
              const formattedTime = eventDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={item.id}
                  className="p-4 sm:px-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Plate + Vehicle Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isInside
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isInside ? (
                        <LogIn className="w-5 h-5" />
                      ) : (
                        <LogOut className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <LicensePlateBadge plate={item.registration_number} size="sm" />
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isInside
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isInside ? 'Currently Inside' : 'Exited'}
                        </span>
                        {item.space_label && (
                          <span className="text-[11px] font-mono-numbers font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                            Bay {item.space_label}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.driver_name && <span>{item.driver_name}</span>}
                        {item.driver_name && <span>·</span>}
                        <span>{item.vehicle_type || 'Vehicle'}</span>
                        <span>·</span>
                        <span>{formattedDate} at {formattedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Duration + Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-mono-numbers font-bold text-slate-800 dark:text-slate-200">
                        {item.duration_minutes
                          ? formatDuration(item.duration_minutes)
                          : 'Ongoing (Active)'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.fee ? `$${item.fee.toFixed(2)}` : 'Rate: $3.50/hr'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isInside && (
                        <button
                          onClick={() => onCheckOutVehicle(item)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 transition-colors"
                        >
                          Check Out
                        </button>
                      )}

                      <button
                        onClick={() => onSelectMovement(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Record"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-slate-400">
              <Car className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No matching vehicle records found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for another registration or changing filters.
              </p>
              <button
                onClick={onOpenRecordMovement}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Record First Movement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
