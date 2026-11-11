import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Sparkles,
  Accessibility,
  Car,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { ParkingSpace, VehicleMovement } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';

interface SpacesViewProps {
  spaces: ParkingSpace[];
  movements: VehicleMovement[];
  onToggleSpaceStatus: (spaceId: string) => void;
  onSelectSpace: (space: ParkingSpace) => void;
  onSelectMovement: (movement: VehicleMovement) => void;
  onOpenRecordMovementWithSpace?: (spaceId: string) => void;
}

export const SpacesView: React.FC<SpacesViewProps> = ({
  spaces,
  movements,
  onToggleSpaceStatus,
  onSelectSpace,
  onSelectMovement,
  onOpenRecordMovementWithSpace
}) => {
  const [selectedZone, setSelectedZone] = useState<'All' | 'A' | 'B' | 'C' | 'D'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'available' | 'occupied' | 'unavailable'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpaces = spaces.filter((space) => {
    const matchesZone = selectedZone === 'All' || space.zone === selectedZone;
    const matchesStatus = statusFilter === 'All' || space.space_status === statusFilter;
    const matchesSearch =
      space.space_label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (space.vehicle_plate && space.vehicle_plate.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesZone && matchesStatus && matchesSearch;
  });

  const totalSpaces = spaces.length;
  const occupiedCount = spaces.filter((s) => s.space_status === 'occupied').length;
  const availableCount = spaces.filter((s) => s.space_status === 'available').length;
  const unavailableCount = spaces.filter((s) => s.space_status === 'unavailable').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls & Statistics Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Live Parking Slot Monitoring
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
              Active Sensors
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status of all 24 North Lot parking bays across Zones A, B, C, and D.
          </p>
        </div>

        {/* Live Counters Pill Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60">
            <div className="text-lg font-mono-numbers font-extrabold text-teal-600 dark:text-teal-400 leading-none">
              {availableCount}
            </div>
            <div className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider mt-0.5">
              Available
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60">
            <div className="text-lg font-mono-numbers font-extrabold text-indigo-600 dark:text-indigo-400 leading-none">
              {occupiedCount}
            </div>
            <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mt-0.5">
              Occupied
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-lg font-mono-numbers font-extrabold text-slate-600 dark:text-slate-300 leading-none">
              {unavailableCount}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
              Maintenance
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bay number (e.g. A2) or license plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Zone Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'A', 'B', 'C', 'D'] as const).map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedZone === zone
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {zone === 'All' ? 'All Zones' : `Zone ${zone}`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-3">
          {(['All', 'available', 'occupied', 'unavailable'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status === 'unavailable' ? 'Maint.' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredSpaces.map((space) => {
          const isOccupied = space.space_status === 'occupied';
          const isAvailable = space.space_status === 'available';
          const isUnavailable = space.space_status === 'unavailable';

          const parkedVehicle = movements.find(
            (m) => m.parking_status === 'inside' && m.parking_space_id === space.id
          );

          return (
            <div
              key={space.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative group ${
                isOccupied
                  ? 'bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-slate-900 border-indigo-200 dark:border-indigo-850 shadow-sm'
                  : isUnavailable
                  ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-gradient-to-br from-teal-50/70 to-white dark:from-teal-950/30 dark:to-slate-900 border-teal-200/80 dark:border-teal-800/60 shadow-xs hover:shadow-md hover:border-teal-400'
              }`}
            >
              {/* Card Header: Slot Name + Type Badge */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-extrabold font-mono-numbers text-slate-900 dark:text-white">
                  {space.space_label}
                </span>

                <div className="flex items-center gap-1">
                  {space.type === 'ev' && (
                    <span className="p-1 rounded-md bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300" title="EV Charging Station">
                      <Zap className="w-3 h-3" />
                    </span>
                  )}
                  {space.type === 'vip' && (
                    <span className="p-1 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300" title="VIP Reserved Bay">
                      <Sparkles className="w-3 h-3" />
                    </span>
                  )}
                  {space.type === 'accessible' && (
                    <span className="p-1 rounded-md bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300" title="Accessible Bay">
                      <Accessibility className="w-3 h-3" />
                    </span>
                  )}

                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOccupied
                        ? 'bg-indigo-600'
                        : isUnavailable
                        ? 'bg-slate-400'
                        : 'bg-teal-500'
                    }`}
                  />
                </div>
              </div>

              {/* Middle: Status & Vehicle Details */}
              <div className="my-3 min-h-[50px] flex flex-col justify-center">
                {isOccupied ? (
                  <div className="space-y-1">
                    <LicensePlateBadge
                      plate={space.vehicle_plate || parkedVehicle?.registration_number || 'VEHICLE'}
                      size="sm"
                    />
                    {parkedVehicle?.driver_name && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {parkedVehicle.driver_name}
                      </p>
                    )}
                  </div>
                ) : isUnavailable ? (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-[11px]">Maintenance</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-[11px]">Ready for Entry</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Quick Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                {isOccupied && parkedVehicle ? (
                  <button
                    onClick={() => onSelectMovement(parkedVehicle)}
                    className="w-full py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between gap-1">
                    <button
                      onClick={() => onToggleSpaceStatus(space.id)}
                      className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                      title={isUnavailable ? 'Mark as Available' : 'Mark as Maintenance'}
                    >
                      {isUnavailable ? 'Unlock' : 'Lock'}
                    </button>

                    {isAvailable && onOpenRecordMovementWithSpace && (
                      <button
                        onClick={() => onOpenRecordMovementWithSpace(space.id)}
                        className="px-2 py-0.5 rounded-md bg-teal-500 hover:bg-teal-600 text-white font-bold text-[10px] transition-colors"
                      >
                        + Park
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Car className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No parking slots found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your zone or status filters.
          </p>
        </div>
      )}
    </div>
  );
};
