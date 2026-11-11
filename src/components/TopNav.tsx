import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  Clock,
  Menu,
  Sparkles,
  MapPin
} from 'lucide-react';
import { ActiveTab } from '../types';

interface TopNavProps {
  activeTab: ActiveTab;
  onOpenRecordModal: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSearchClick: () => void;
  onToggleMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  onOpenRecordModal,
  onOpenNotifications,
  notificationCount,
  darkMode,
  onToggleDarkMode,
  onSearchClick,
  onToggleMobileMenu
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabLabels: Record<ActiveTab, { title: string; subtitle: string }> = {
    Dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time parking status & bay distribution' },
    Spaces: { title: 'Live Parking Monitoring', subtitle: 'Interactive visual slot map and bay status' },
    Movements: { title: 'Vehicle Management', subtitle: 'Search registrations and complete movement logs' },
    Activity: { title: 'Reports & Analytics', subtitle: 'Turnaround statistics, peak hours, and trends' },
    Revenue: { title: 'Revenue & Tariff Billing', subtitle: 'Hourly fees, active revenue, and payment tickets' },
    Notifications: { title: 'Facility Alerts', subtitle: 'Occupancy thresholds and vehicle overstays' },
    Staff: { title: 'Staff & Shift Management', subtitle: 'Attendant duty logs and shift assignments' },
    Settings: { title: 'Facility Configuration', subtitle: 'Capacity thresholds, parking rates, and cameras' }
  };

  const currentMeta = tabLabels[activeTab] || tabLabels.Dashboard;

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Menu + View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {currentMeta.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              <MapPin className="w-3 h-3 text-teal-500" />
              North Lot
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Clock Chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs font-mono-numbers text-slate-700 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{formattedDate}</span>
          <span className="text-slate-400">·</span>
          <span className="font-semibold text-slate-900 dark:text-white">{formattedTime}</span>
        </div>

        {/* Search Trigger */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700"
          title="Search Vehicles by License Plate"
        >
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Search plates...</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Primary CTA: Record Movement */}
        <button
          onClick={onOpenRecordModal}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 hover:from-indigo-500 hover:via-purple-500 hover:to-teal-400 shadow-md shadow-indigo-500/25 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="whitespace-nowrap">Record Movement</span>
        </button>
      </div>
    </header>
  );
};
