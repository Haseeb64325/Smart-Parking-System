import React, { useState, useEffect } from 'react';
import {
  X,
  Car,
  LogIn,
  LogOut,
  MapPin,
  Check,
  Zap,
  Sparkles,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { ParkingSpace, VehicleMovement } from '../types';
import { LicensePlateBadge } from './LicensePlateBadge';

interface RecordMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: ParkingSpace[];
  movements: VehicleMovement[];
  initialSpaceId?: string | null;
  onSaveMovement: (data: {
    registration_number: string;
    mode: 'Entry' | 'Exit';
    parking_space_id: string | null;
    vehicle_type: 'Sedan' | 'SUV' | 'EV' | 'Van' | 'Truck';
    driver_name?: string;
  }) => void;
}

export const RecordMovementModal: React.FC<RecordMovementModalProps> = ({
  isOpen,
  onClose,
  spaces,
  movements,
  initialSpaceId = null,
  onSaveMovement
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'Entry' | 'Exit'>('Entry');
  const [plate, setPlate] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(initialSpaceId);
  const [vehicleType, setVehicleType] = useState<'Sedan' | 'SUV' | 'EV' | 'Van' | 'Truck'>('Sedan');
  const [driverName, setDriverName] = useState('');
  const [locationConfirmed, setLocationConfirmed] = useState(true);
  const [isVerifyingLocation, setIsVerifyingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available spaces
  const availableSpaces = spaces.filter((s) => s.space_status === 'available');

  // Active vehicles currently parked
  const activeParkedVehicles = movements.filter((m) => m.parking_status === 'inside');

  // Automatically select initial space if provided
  useEffect(() => {
    if (initialSpaceId) {
      setSelectedSpaceId(initialSpaceId);
    } else if (availableSpaces.length > 0 && !selectedSpaceId) {
      setSelectedSpaceId(availableSpaces[0].id);
    }
  }, [initialSpaceId]);

  const handleSimulateGPS = () => {
    setIsVerifyingLocation(true);
    setTimeout(() => {
      setIsVerifyingLocation(false);
      setLocationConfirmed(true);
    }, 500);
  };

  const handleSave = () => {
    setError(null);
    const cleanedPlate = plate.trim().toUpperCase();

    if (!cleanedPlate) {
      setError('Please enter a vehicle license plate number.');
      return;
    }

    if (mode === 'Entry') {
      const alreadyParked = activeParkedVehicles.find(
        (m) => m.registration_number.toUpperCase() === cleanedPlate
      );
      if (alreadyParked) {
        setError(`Vehicle ${cleanedPlate} already has an active entry in Bay ${alreadyParked.space_label || 'North Lot'}.`);
        return;
      }
    } else {
      const isParked = activeParkedVehicles.find(
        (m) => m.registration_number.toUpperCase() === cleanedPlate
      );
      if (!isParked) {
        setError(`Vehicle ${cleanedPlate} was not found inside North Lot. Please select an active vehicle.`);
        return;
      }
    }

    onSaveMovement({
      registration_number: cleanedPlate,
      mode,
      parking_space_id: mode === 'Entry' ? selectedSpaceId : null,
      vehicle_type: vehicleType,
      driver_name: driverName.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {mode === 'Entry' ? <LogIn className="w-5 h-5 text-teal-600" /> : <LogOut className="w-5 h-5 text-purple-600" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Record Movement</h2>
              <p className="text-xs text-slate-500">Keep the North Lot movement log up to date</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Movement Mode Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Movement Direction
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setMode('Entry');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'Entry'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Vehicle Entry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('Exit');
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === 'Exit'
                    ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Vehicle Exit</span>
              </button>
            </div>
          </div>

          {/* Registration Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Registration Number
              </label>
              {plate && <LicensePlateBadge plate={plate.toUpperCase()} size="sm" />}
            </div>

            <input
              type="text"
              placeholder="e.g. KJH 482 or 8VXR219"
              value={plate}
              onChange={(e) => {
                setPlate(e.target.value.toUpperCase());
                setError(null);
              }}
              className="w-full px-4 py-3 rounded-xl text-base font-mono-numbers font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-wider uppercase"
              autoFocus
            />
          </div>

          {/* Location Confirmation Pill Card */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/70 text-teal-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">North Lot Terminal</p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                  {locationConfirmed ? 'Geofenced · Gate 01 Confirmed' : 'Location pending verification'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateGPS}
              disabled={isVerifyingLocation}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Navigation className={`w-3.5 h-3.5 ${isVerifyingLocation ? 'animate-spin' : ''}`} />
              <span>Verify</span>
            </button>
          </div>

          {/* If Entry: Space Selection */}
          {mode === 'Entry' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Assign Parking Bay
                </label>
                <span className="text-xs text-teal-600 dark:text-teal-400 font-mono-numbers">
                  {availableSpaces.length} available
                </span>
              </div>

              {availableSpaces.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSpaces.map((space) => {
                    const isSelected = selectedSpaceId === space.id;
                    return (
                      <button
                        key={space.id}
                        type="button"
                        onClick={() => setSelectedSpaceId(space.id)}
                        className={`py-2 px-1 rounded-xl text-xs font-extrabold font-mono-numbers transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-sm ring-2 ring-teal-400 scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {space.space_label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                  No designated bays currently free. Vehicle will be logged in Overflow / Drop-off bay.
                </div>
              )}
            </div>
          ) : (
            /* If Exit: Quick Select from active parked vehicles */
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Quick Select Active Vehicle ({activeParkedVehicles.length} Inside)
              </label>

              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                {activeParkedVehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setPlate(v.registration_number)}
                    className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LicensePlateBadge plate={v.registration_number} size="sm" />
                      <span className="text-xs text-slate-500">
                        {v.space_label ? `Bay ${v.space_label}` : 'North Lot'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Type and Driver Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="EV">Electric (EV)</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Driver Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Green"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 hover:from-indigo-500 hover:via-purple-500 hover:to-teal-400 shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {mode === 'Entry' ? 'Confirm Vehicle Entry' : 'Confirm Vehicle Exit'}
          </button>
        </div>
      </div>
    </div>
  );
};
