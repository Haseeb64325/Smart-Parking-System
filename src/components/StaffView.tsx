import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  Plus,
  UserCheck
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const [staffList, setStaffList] = useState([
    {
      id: 'staff-1',
      name: 'Alexander Novak',
      role: 'Chief Parking Officer',
      shift: 'Morning (06:00 - 14:30)',
      status: 'On Duty',
      phone: '+1 (555) 234-8901',
      email: 'a.novak@smartpark.io'
    },
    {
      id: 'staff-2',
      name: 'Samantha Wright',
      role: 'Gate 01 Operations Lead',
      shift: 'Afternoon (14:00 - 22:30)',
      status: 'On Duty',
      phone: '+1 (555) 987-6543',
      email: 's.wright@smartpark.io'
    },
    {
      id: 'staff-3',
      name: 'Derrick Chen',
      role: 'Security & EV Bay Attendant',
      shift: 'Night (22:00 - 06:30)',
      status: 'Scheduled',
      phone: '+1 (555) 345-6789',
      email: 'd.chen@smartpark.io'
    }
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Staff & Shift Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            North Lot parking attendants, gate operations officers, and shift rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            2 Attendants Active on Site
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffList.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    member.status === 'On Duty'
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3">
                {member.name}
              </h3>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {member.role}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.shift}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Connecting to radio channel for ${member.name}...`)}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Direct Intercom Call
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
