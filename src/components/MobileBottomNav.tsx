import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Car,
  BarChart3,
  Plus
} from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenRecord: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenRecord
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'Dashboard', label: 'Lot', icon: LayoutDashboard },
    { id: 'Spaces', label: 'Spaces', icon: Activity },
    { id: 'Movements', label: 'Vehicles', icon: Car },
    { id: 'Activity', label: 'Activity', icon: BarChart3 }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 px-3 py-2 shadow-2xl pb-safe">
      <div className="flex items-center justify-around relative">
        {tabs.slice(0, 2).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-teal-400 scale-105 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-teal-400 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Center Floating Plus Action */}
        <div className="relative -top-3 px-2">
          <button
            onClick={onOpenRecord}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
            aria-label="Record Movement"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {tabs.slice(2, 4).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-teal-400 scale-105 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-teal-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
