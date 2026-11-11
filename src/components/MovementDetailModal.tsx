import React, { useState, useEffect } from 'react';
import {
  X,
  Car,
  Clock,
  MapPin,
  Calendar,
  CircleDollarSign,
  Printer,
  LogOut,
  CheckCircle2,
  Share2,
  Shield,
  ArrowRight
} from 'lucide-react';
import { VehicleMovement, ParkingSpace } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';
import { formatDuration, calculateFee } from '../data/mockData';

interface MovementDetailModalProps {
  movement: VehicleMovement | null;
  onClose: () => void;
  onCheckOut: (movement: VehicleMovement) => void;
  spaces: ParkingSpace[];
  onSelectOtherMovement: (movement: VehicleMovement) => void;
  allMovements: VehicleMovement[];
}

export const MovementDetailModal: React.FC<MovementDetailModalProps> = ({
  movement,
  onClose,
  onCheckOut,
  spaces,
  onSelectOtherMovement,
  allMovements
}) => {
  if (!movement) return null;

  const [liveDuration, setLiveDuration] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);

  const isInside = movement.parking_status === 'inside';
  const entryDate = new Date(movement.entry_at);
  const exitDate = movement.exit_at ? new Date(movement.exit_at) : null;

  // Live timer if inside
  useEffect(() => {
    const updateTime = () => {
      if (isInside) {
        const mins = Math.max(0, Math.round((Date.now() - entryDate.getTime()) / 60000));
        setLiveDuration(mins);
      } else {
        setLiveDuration(movement.duration_minutes || 0);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [movement, isInside]);

  const currentFee = movement.fee || calculateFee(movement.entry_at, movement.exit_at);

  const otherMovements = allMovements
    .filter((m) => m.id !== movement.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Movement Details</h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono-numbers text-slate-500">{movement.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Hero Plate & Status Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white border border-indigo-900/60 shadow-lg relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-extrabold tracking-wider text-indigo-300 uppercase">
                  VEHICLE REGISTRATION
                </p>
                <div className="mt-2">
                  <LicensePlateBadge plate={movement.registration_number} size="lg" />
                </div>
                <p className="text-xs text-indigo-200/80 mt-2 font-medium">
                  North Lot · {movement.space_label ? `Bay ${movement.space_label}` : 'Drop-off Zone'}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isInside
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                }`}
              >
                {isInside ? 'Currently Parked' : 'Exited'}
              </span>
            </div>

            {/* Duration Block */}
            <div className="mt-6 pt-5 border-t border-indigo-900/60 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold tracking-wider text-indigo-300/80 uppercase">
                  PARKING DURATION
                </p>
                <p className="text-3xl font-extrabold font-mono-numbers text-white mt-0.5">
                  {formatDuration(liveDuration)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-extrabold tracking-wider text-indigo-300/80 uppercase">
                  ACCRUED TARIFF
                </p>
                <p className="text-2xl font-extrabold font-mono-numbers text-teal-400 mt-0.5">
                  ${currentFee.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Movement Record Details Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Movement Record
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 divide-y divide-slate-200/60 dark:divide-slate-700/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Entry Timestamp</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                  {entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at{' '}
                  {entryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Assigned Bay</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {movement.space_label ? `Bay ${movement.space_label} (North Lot)` : 'General Lot'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Exit Timestamp</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono-numbers">
                  {exitDate
                    ? `${exitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${exitDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Active on Site'}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Vehicle Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {movement.vehicle_type || 'Sedan'}
                </span>
              </div>

              {movement.driver_name && (
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-500">Driver</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {movement.driver_name}
                  </span>
                </div>
              )}

              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500">Current Status</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {isInside ? 'On site (Active)' : 'Exited (Closed)'}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt View Simulator */}
          {showReceipt && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold border-b border-amber-200 pb-1">
                <span>SmartPark Receipt #SP-{movement.id}</span>
                <span>PAID</span>
              </div>
              <p>Vehicle: {movement.registration_number}</p>
              <p>Duration: {formatDuration(liveDuration)}</p>
              <p className="font-bold">Total Charged: ${currentFee.toFixed(2)} via Gate Terminal</p>
            </div>
          )}

          {/* Other recent movements for quick navigation */}
          {otherMovements.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Recent Facility Movements
              </h3>

              <div className="space-y-1.5">
                {otherMovements.map((other) => (
                  <div
                    key={other.id}
                    onClick={() => onSelectOtherMovement(other)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LicensePlateBadge plate={other.registration_number} size="sm" />
                      <span className="text-xs text-slate-500">
                        {other.space_label ? `Bay ${other.space_label}` : 'North lot'}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowReceipt(!showReceipt)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{showReceipt ? 'Hide Receipt' : 'Print Ticket'}</span>
          </button>

          <div className="flex items-center gap-2">
            {isInside && (
              <button
                onClick={() => {
                  onCheckOut(movement);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 active:scale-95 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Record Vehicle Exit</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
