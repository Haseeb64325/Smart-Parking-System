import React from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Car,
  ShieldAlert
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 'alert-1',
      type: 'warning',
      title: 'North Lot High Occupancy Warning (75%)',
      time: '12 minutes ago',
      desc: '18 of 24 bays are currently in use. Consider opening auxiliary overflow lane B.',
      unread: true
    },
    {
      id: 'alert-2',
      type: 'info',
      title: 'Extended Stay Alert: Bay D4',
      time: '45 minutes ago',
      desc: 'Vehicle 3MXZ908 has been parked for 6 hours. Tariff updated to $21.00.',
      unread: true
    },
    {
      id: 'alert-3',
      type: 'success',
      title: 'EV Supercharger Station A3 Operational',
      time: '2 hours ago',
      desc: 'Smart sensor diagnostics passed. 22kW charging stall is free and ready.',
      unread: false
    },
    {
      id: 'alert-4',
      type: 'info',
      title: 'Automated Daily Shift Backup Completed',
      time: '5 hours ago',
      desc: 'Movement transaction records synced with cloud terminal storage.',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Facility Notifications</h2>
              <p className="text-xs text-slate-500">Live system alerts and capacity signals</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                alert.unread
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {alert.type === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  {alert.type === 'info' && (
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  )}
                  {alert.type === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  )}
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {alert.title}
                  </h3>
                </div>

                {alert.unread && (
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1" />
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 pl-6">
                {alert.desc}
              </p>

              <div className="mt-2 pl-6 text-[10px] text-slate-400 font-medium">
                {alert.time}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};
