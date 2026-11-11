import React, { useState, useEffect } from 'react';
import { ActiveTab, ParkingSpace, VehicleMovement, ToastMessage } from './types';
import {
  INITIAL_SPACES,
  getInitialMovements,
  calculateFee
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { SpacesView } from './components/SpacesView';
import { MovementsView } from './components/MovementsView';
import { ActivityView } from './components/ActivityView';
import { RevenueView } from './components/RevenueView';
import { StaffView } from './components/StaffView';
import { SettingsView } from './components/SettingsView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { RecordMovementModal } from './components/RecordMovementModal';
import { MovementDetailModal } from './components/MovementDetailModal';
import { NotificationsModal } from './components/NotificationsModal';
import { SearchModal } from './components/SearchModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smartpark_dark_mode');
      return saved ? saved === 'true' : true; // Default to sleek midnight navy dark mode
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('smartpark_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Parking Spaces State
  const [spaces, setSpaces] = useState<ParkingSpace[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smartpark_spaces');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_SPACES;
  });

  // Vehicle Movements State
  const [movements, setMovements] = useState<VehicleMovement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smartpark_movements');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return getInitialMovements();
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem('smartpark_spaces', JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem('smartpark_movements', JSON.stringify(movements));
  }, [movements]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordInitialSpaceId, setRecordInitialSpaceId] = useState<string | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<VehicleMovement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers
  const handleRecordMovement = (data: {
    registration_number: string;
    mode: 'Entry' | 'Exit';
    parking_space_id: string | null;
    vehicle_type: 'Sedan' | 'SUV' | 'EV' | 'Van' | 'Truck';
    driver_name?: string;
  }) => {
    if (data.mode === 'Entry') {
      const spaceObj = spaces.find((s) => s.id === data.parking_space_id);
      const newMovement: VehicleMovement = {
        id: `mov-${Date.now()}`,
        registration_number: data.registration_number,
        entry_at: new Date().toISOString(),
        parking_status: 'inside',
        parking_space_id: data.parking_space_id,
        space_label: spaceObj?.space_label || 'North Lot',
        vehicle_type: data.vehicle_type,
        driver_name: data.driver_name,
        fee: 3.50
      };

      setMovements((prev) => [newMovement, ...prev]);

      if (data.parking_space_id) {
        setSpaces((prev) =>
          prev.map((s) =>
            s.id === data.parking_space_id
              ? {
                  ...s,
                  space_status: 'occupied',
                  vehicle_plate: data.registration_number,
                  occupied_since: new Date().toISOString()
                }
              : s
          )
        );
      }

      addToast(
        'success',
        'Vehicle Entry Logged',
        `${data.registration_number} recorded in ${spaceObj ? `Bay ${spaceObj.space_label}` : 'North Lot'}`
      );
    } else {
      // Exit Mode
      const activeVehicle = movements.find(
        (m) =>
          m.parking_status === 'inside' &&
          m.registration_number.toUpperCase() === data.registration_number.toUpperCase()
      );

      if (activeVehicle) {
        handleCheckOut(activeVehicle);
      }
    }
  };

  const handleCheckOut = (movement: VehicleMovement) => {
    const exitTime = new Date().toISOString();
    const duration = Math.max(
      15,
      Math.round((new Date(exitTime).getTime() - new Date(movement.entry_at).getTime()) / 60000)
    );
    const fee = calculateFee(movement.entry_at, exitTime);

    setMovements((prev) =>
      prev.map((m) =>
        m.id === movement.id
          ? {
              ...m,
              exit_at: exitTime,
              duration_minutes: duration,
              parking_status: 'exited',
              fee
            }
          : m
      )
    );

    // Free up space
    if (movement.parking_space_id) {
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === movement.parking_space_id
            ? { ...s, space_status: 'available', vehicle_plate: undefined, occupied_since: undefined }
            : s
        )
      );
    }

    addToast(
      'success',
      'Vehicle Exit Recorded',
      `${movement.registration_number} checked out. Fee: $${fee.toFixed(2)}`
    );
  };

  const handleToggleSpaceStatus = (spaceId: string) => {
    const space = spaces.find((s) => s.id === spaceId);
    if (!space) return;

    if (space.space_status === 'occupied') {
      addToast('info', 'Bay Occupied', `Bay ${space.space_label} is occupied by an active vehicle.`);
      return;
    }

    const nextStatus = space.space_status === 'available' ? 'unavailable' : 'available';

    setSpaces((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, space_status: nextStatus } : s))
    );

    addToast(
      'info',
      'Bay Status Changed',
      `Bay ${space.space_label} is now marked as ${nextStatus === 'available' ? 'Available' : 'Maintenance'}`
    );
  };

  const handleResetData = () => {
    setSpaces(INITIAL_SPACES);
    setMovements(getInitialMovements());
    localStorage.removeItem('smartpark_spaces');
    localStorage.removeItem('smartpark_movements');
    addToast('info', 'State Reset', 'Demonstration parking data has been restored.');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Desktop Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        spaces={spaces}
        movements={movements}
        notificationCount={2}
        className="hidden lg:flex"
      />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-slate-950 text-white animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              spaces={spaces}
              movements={movements}
              notificationCount={2}
              className="w-full h-full border-r-0"
            />
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header */}
        <TopNav
          activeTab={activeTab}
          onOpenRecordModal={() => {
            setRecordInitialSpaceId(null);
            setIsRecordModalOpen(true);
          }}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          notificationCount={2}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onSearchClick={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* View Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 lg:pb-8">
          {activeTab === 'Dashboard' && (
            <DashboardView
              spaces={spaces}
              movements={movements}
              onNavigateToMovements={() => setActiveTab('Movements')}
              onNavigateToSpaces={() => setActiveTab('Spaces')}
              onSelectMovement={(m) => setSelectedMovement(m)}
              onSelectSpace={(s) => {
                setRecordInitialSpaceId(s.id);
                setIsRecordModalOpen(true);
              }}
              onOpenRecordMovement={() => {
                setRecordInitialSpaceId(null);
                setIsRecordModalOpen(true);
              }}
            />
          )}

          {activeTab === 'Spaces' && (
            <SpacesView
              spaces={spaces}
              movements={movements}
              onToggleSpaceStatus={handleToggleSpaceStatus}
              onSelectSpace={(s) => {
                setRecordInitialSpaceId(s.id);
                setIsRecordModalOpen(true);
              }}
              onSelectMovement={(m) => setSelectedMovement(m)}
              onOpenRecordMovementWithSpace={(spaceId) => {
                setRecordInitialSpaceId(spaceId);
                setIsRecordModalOpen(true);
              }}
            />
          )}

          {activeTab === 'Movements' && (
            <MovementsView
              movements={movements}
              onSelectMovement={(m) => setSelectedMovement(m)}
              onOpenRecordMovement={() => {
                setRecordInitialSpaceId(null);
                setIsRecordModalOpen(true);
              }}
              onCheckOutVehicle={handleCheckOut}
            />
          )}

          {activeTab === 'Activity' && (
            <ActivityView
              spaces={spaces}
              movements={movements}
              onSelectMovement={(m) => setSelectedMovement(m)}
              onOpenRecordMovement={() => {
                setRecordInitialSpaceId(null);
                setIsRecordModalOpen(true);
              }}
            />
          )}

          {activeTab === 'Revenue' && (
            <RevenueView
              movements={movements}
              onSelectMovement={(m) => setSelectedMovement(m)}
            />
          )}

          {activeTab === 'Notifications' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold">Facility Notifications & Sensor Signals</h2>
                <p className="text-xs text-slate-500 mt-1">Live alerts generated by North Lot gate and bay probers.</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">North Lot High Occupancy Warning (75%)</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">18 of 24 bays are currently in use. Consider opening auxiliary overflow lane B.</div>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono-numbers">12 minutes ago</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white">Extended Stay Alert: Bay D4</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">Vehicle 3MXZ908 has been parked for 6 hours. Tariff updated to $21.00.</div>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono-numbers">45 minutes ago</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Staff' && <StaffView />}

          {activeTab === 'Settings' && <SettingsView onResetData={handleResetData} />}
        </main>
      </div>

      {/* Responsive Mobile Bottom Dock */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRecord={() => {
          setRecordInitialSpaceId(null);
          setIsRecordModalOpen(true);
        }}
      />

      {/* Record Movement Modal */}
      <RecordMovementModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        spaces={spaces}
        movements={movements}
        initialSpaceId={recordInitialSpaceId}
        onSaveMovement={handleRecordMovement}
      />

      {/* Movement Details Modal */}
      <MovementDetailModal
        movement={selectedMovement}
        onClose={() => setSelectedMovement(null)}
        onCheckOut={handleCheckOut}
        spaces={spaces}
        onSelectOtherMovement={(m) => setSelectedMovement(m)}
        allMovements={movements}
      />

      {/* Facility Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        movements={movements}
        onSelectMovement={(m) => setSelectedMovement(m)}
      />

      {/* Feedback Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
