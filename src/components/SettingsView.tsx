import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  DollarSign,
  Camera,
  Shield,
  RotateCcw,
  Save,
  Check
} from 'lucide-react';
import { HOURLY_RATE, DAILY_MAX_RATE } from '../data/mockData';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [lotName, setLotName] = useState('North Lot Facility');
  const [hourlyRate, setHourlyRate] = useState(HOURLY_RATE);
  const [dailyCap, setDailyCap] = useState(DAILY_MAX_RATE);
  const [autoBarrier, setAutoBarrier] = useState(true);
  const [anprCameras, setAnprCameras] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Facility Settings & Automation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure automated barrier gates, tariff rules, and smart sensor parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm active:scale-95 transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-teal-300" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* General Lot Configuration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            General Facility Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Facility Designation Name
              </label>
              <input
                type="text"
                value={lotName}
                onChange={(e) => setLotName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Occupancy Alert Threshold ({alertThreshold}%)
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600 mt-2 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Tariff Rules */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-500" />
            Tariff & Fee Engine
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Base Hourly Tariff Rate ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono-numbers"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Maximum 24-Hour Cap ($)
              </label>
              <input
                type="number"
                step="1"
                value={dailyCap}
                onChange={(e) => setDailyCap(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono-numbers"
              />
            </div>
          </div>
        </div>

        {/* Barrier & Hardware Automation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-purple-500" />
            Hardware & Sensor Automation
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Automatic ANPR License Plate Recognition
                </p>
                <p className="text-slate-500 text-[11px]">
                  Optical camera reads registration plate on inbound entry.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnprCameras(!anprCameras)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  anprCameras ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    anprCameras ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Automated Boom Barrier Raise
                </p>
                <p className="text-slate-500 text-[11px]">
                  Opens barrier automatically once plate is verified in database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoBarrier(!autoBarrier)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  autoBarrier ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    autoBarrier ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Maintenance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Reset Demonstration State
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Restore initial 24 parking bays and sample movement logs.
            </p>
          </div>

          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
