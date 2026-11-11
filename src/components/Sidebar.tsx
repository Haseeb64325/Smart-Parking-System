import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Layers,
  Car,
  ArrowLeftRight,
  CircleDollarSign,
  BarChart3,
  Bell,
  Users,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ActiveTab, ParkingSpace, VehicleMovement } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  spaces: ParkingSpace[];
  movements: VehicleMovement[];
  notificationCount: number;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  spaces,
  movements,
  notificationCount,
  className = ''
}) => {
  const occupiedCount = spaces.filter((s) => s.space_status === 'occupied').length;
  const totalCapacity = spaces.length;
  const occupancyPercent = totalCapacity > 0 ? Math.round((occupiedCount / totalCapacity) * 100) : 0;
  const insideCount = movements.filter((m) => m.parking_status === 'inside').length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number }[] = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Spaces', label: 'Live Monitoring', icon: Activity, badge: `${occupiedCount}/${totalCapacity}` },
    { id: 'Movements', label: 'Vehicle Management', icon: Car, badge: insideCount },
    { id: 'Activity', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'Revenue', label: 'Revenue & Payments', icon: CircleDollarSign },
    { id: 'Notifications', label: 'Notifications', icon: Bell, badge: notificationCount > 0 ? notificationCount : undefined },
    { id: 'Staff', label: 'Staff Management', icon: Users },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 shrink-0 flex flex-col h-full bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-200 border-r border-indigo-950/60 shadow-xl select-none ${className}`}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-indigo-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Car className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">SmartPark</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">PRO</span>
            </div>
            <p className="text-[11px] text-indigo-200/60 font-medium">North Lot Facility</p>
          </div>
        </div>
      </div>

      {/* Lot Status Mini-Card */}
      <div className="mx-4 mt-4 p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/80 to-purple-950/50 border border-indigo-800/40 shadow-inner">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-indigo-200">North Lot Live Load</span>
          <span className="text-teal-400 font-mono-numbers font-bold">{occupancyPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900/80 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-indigo-400 to-purple-500 transition-all duration-500"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono-numbers">
          <span>{occupiedCount} occupied</span>
          <span className="text-teal-300 font-semibold">{totalCapacity - occupiedCount} free</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-indigo-300/60 uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/80 text-white shadow-md shadow-indigo-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-indigo-300/80 group-hover:text-teal-300 group-hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono-numbers font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/40'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User / Facility Footer */}
      <div className="p-3 border-t border-indigo-950/80 bg-slate-950/50">
        <div className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                AD
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 ring-2 ring-slate-950" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Admin Console</p>
              <p className="text-[10px] text-indigo-300/70 font-medium">Control Station 01</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-300/50" />
        </div>
      </div>
    </aside>
  );
};
