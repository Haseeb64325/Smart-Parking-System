import React from 'react';
import {
  Layers,
  Car,
  CheckCircle2,
  LogIn,
  LogOut,
  PieChart,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  Info
} from 'lucide-react';
import { ParkingSpace, VehicleMovement } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';
import { formatDuration } from '../data/mockData';

interface DashboardViewProps {
  spaces: ParkingSpace[];
  movements: VehicleMovement[];
  onNavigateToMovements: () => void;
  onNavigateToSpaces: () => void;
  onSelectMovement: (movement: VehicleMovement) => void;
  onSelectSpace: (space: ParkingSpace) => void;
  onOpenRecordMovement: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  spaces,
  movements,
  onNavigateToMovements,
  onNavigateToSpaces,
  onSelectMovement,
  onSelectSpace,
  onOpenRecordMovement
}) => {
  const totalCapacity = spaces.length;
  const occupiedSpaces = spaces.filter((s) => s.space_status === 'occupied');
  const occupiedCount = occupiedSpaces.length;
  const availableCount = spaces.filter((s) => s.space_status === 'available').length;
  const unavailableCount = spaces.filter((s) => s.space_status === 'unavailable').length;
  const occupancyPercent = totalCapacity > 0 ? Math.round((occupiedCount / totalCapacity) * 100) : 0;

  const todayStr = new Date().toDateString();
  const enteredToday = movements.filter((m) => new Date(m.entry_at).toDateString() === todayStr).length;
  const exitedToday = movements.filter((m) => m.exit_at && new Date(m.exit_at).toDateString() === todayStr).length;
  const insideMovements = movements.filter((m) => m.parking_status === 'inside');

  // Sorted recent movements
  const recentMovements = [...movements]
    .sort((a, b) => {
      const timeA = new Date(a.exit_at || a.entry_at).getTime();
      const timeB = new Date(b.exit_at || b.entry_at).getTime();
      return timeB - timeA;
    })
    .slice(0, 6);

  // Group spaces by Zone
  const zones: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const zoneDescriptions: Record<'A' | 'B' | 'C' | 'D', string> = {
    A: 'Zone A · VIP & EV Fast Charging',
    B: 'Zone B · Central Covered Canopy',
    C: 'Zone C · Standard South Bays',
    D: 'Zone D · Quick Transit & Delivery'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome / Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 md:p-8 shadow-xl border border-indigo-900/50">
        {/* Subtle decorative glow circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Facility Sensor Grid Active
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              North Lot Operational Dashboard
            </h2>
            <p className="text-sm text-indigo-200/80 mt-1 max-w-2xl">
              Real-time bay monitoring, automated entry timestamps, and live parking duration analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToSpaces}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all active:scale-95"
            >
              Monitor Bays
            </button>
            <button
              onClick={onOpenRecordMovement}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-300 hover:to-indigo-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95"
            >
              + Quick Record
            </button>
          </div>
        </div>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Capacity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {totalCapacity}
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Total capacity
          </p>
        </div>

        {/* Cars Currently Inside */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/70 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">Live</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {insideMovements.length}
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Cars inside
          </p>
        </div>

        {/* Available Spaces */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">Ready</span>
          </div>
          <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono-numbers">
            {availableCount}
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Available bays
          </p>
        </div>

        {/* Entered Today */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Inbound</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {enteredToday}
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Entered today
          </p>
        </div>

        {/* Exited Today */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Outbound</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
            {exitedToday}
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Exited today
          </p>
        </div>

        {/* Occupancy Rate */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/70 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">Load</span>
          </div>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono-numbers">
            {occupancyPercent}%
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Occupancy rate
          </p>
        </div>
      </div>

      {/* Main Section: Interactive Space Card & Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: North Lot Parking Map (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[11px] font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                NORTH LOT / PARKING MAP
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-numbers">
                  {occupiedCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  of {totalCapacity} spaces used
                </span>
              </div>
            </div>

            {/* Available Highlight Badge */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/60 text-center">
                <div className="text-xl font-extrabold text-teal-600 dark:text-teal-400 font-mono-numbers leading-none">
                  {availableCount}
                </div>
                <div className="text-[9px] font-extrabold text-teal-700 dark:text-teal-300 tracking-wider uppercase mt-1">
                  AVAILABLE
                </div>
              </div>
            </div>
          </div>

          {/* Bay Grid organized by rows A, B, C, D */}
          <div className="mt-6 space-y-4">
            {zones.map((zone) => {
              const zoneSpaces = spaces.filter((s) => s.zone === zone);
              return (
                <div key={zone} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-1">
                    <span>{zoneDescriptions[zone]}</span>
                    <span className="font-mono-numbers">
                      {zoneSpaces.filter((s) => s.space_status === 'occupied').length}/{zoneSpaces.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {zoneSpaces.map((space) => {
                      const isOccupied = space.space_status === 'occupied';
                      const isUnavailable = space.space_status === 'unavailable';
                      const isAvailable = space.space_status === 'available';

                      // Find vehicle parked here if occupied
                      const parkedVehicle = movements.find(
                        (m) => m.parking_status === 'inside' && m.parking_space_id === space.id
                      );

                      return (
                        <button
                          key={space.id}
                          onClick={() => {
                            if (parkedVehicle) {
                              onSelectMovement(parkedVehicle);
                            } else {
                              onSelectSpace(space);
                            }
                          }}
                          className={`group relative min-h-[58px] p-2 rounded-xl flex flex-col justify-between items-center text-center transition-all duration-200 cursor-pointer ${
                            isOccupied
                              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/70 dark:to-purple-950/60 border border-indigo-200/80 dark:border-indigo-800/80 hover:scale-[1.03] hover:shadow-md'
                              : isUnavailable
                              ? 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 opacity-60'
                              : 'bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 hover:bg-teal-100/70 dark:hover:bg-teal-900/40 hover:scale-[1.03] hover:shadow-md'
                          }`}
                          title={
                            isOccupied
                              ? `Occupied by ${space.vehicle_plate || parkedVehicle?.registration_number || 'Vehicle'} - Click to view`
                              : isUnavailable
                              ? `${space.space_label}: Unavailable / Maintenance`
                              : `${space.space_label}: Free - Click to park or manage`
                          }
                        >
                          <div className="w-full flex items-center justify-between text-[11px] font-extrabold">
                            <span
                              className={`${
                                isOccupied
                                  ? 'text-indigo-700 dark:text-indigo-300'
                                  : isUnavailable
                                  ? 'text-slate-500'
                                  : 'text-teal-700 dark:text-teal-400'
                              }`}
                            >
                              {space.space_label}
                            </span>
                            {space.type === 'ev' && (
                              <Zap className="w-3 h-3 text-teal-500" />
                            )}
                            {space.type === 'vip' && (
                              <Sparkles className="w-3 h-3 text-purple-500" />
                            )}
                          </div>

                          <div className="w-full mt-1 flex items-center justify-center">
                            {isOccupied ? (
                              <div className="flex flex-col items-center">
                                <Car className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-[9px] font-mono-numbers font-bold text-slate-800 dark:text-slate-200 truncate max-w-[48px]">
                                  {space.vehicle_plate || parkedVehicle?.registration_number || 'CAR'}
                                </span>
                              </div>
                            ) : isUnavailable ? (
                              <span className="text-[9px] font-bold text-slate-400 uppercase">
                                LOCK
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                FREE
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span className="text-slate-600 dark:text-slate-400">Available ({availableCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span className="text-slate-600 dark:text-slate-400">Occupied ({occupiedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Maintenance ({unavailableCount})</span>
              </div>
            </div>

            <button
              onClick={onNavigateToSpaces}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
            >
              Detailed Bay Manager
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Recent Movements (4-5 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Movements
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest vehicle check-ins and exits
                </p>
              </div>
              <button
                onClick={onNavigateToMovements}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Movement list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {recentMovements.length > 0 ? (
                recentMovements.map((item) => {
                  const isInside = item.parking_status === 'inside';
                  const timestamp = new Date(item.exit_at || item.entry_at);
                  const formattedTime = timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectMovement(item)}
                      className="py-3 px-1.5 flex items-center justify-between rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isInside
                              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isInside ? (
                            <LogIn className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          ) : (
                            <LogOut className="w-4 h-4 text-slate-500" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-numbers font-bold text-sm text-slate-900 dark:text-white truncate">
                              {item.registration_number}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                isInside
                                  ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {isInside ? 'Inside' : 'Exited'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{item.space_label ? `Bay ${item.space_label}` : 'North lot'}</span>
                            <span>·</span>
                            <span>{formattedTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {item.duration_minutes ? (
                          <span className="text-xs font-mono-numbers font-medium text-slate-500 dark:text-slate-400">
                            {formatDuration(item.duration_minutes)}
                          </span>
                        ) : (
                          <span className="text-xs font-mono-numbers font-semibold text-teal-600 dark:text-teal-400">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No movements recorded yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Button at bottom */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onOpenRecordMovement}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Record Vehicle Movement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
