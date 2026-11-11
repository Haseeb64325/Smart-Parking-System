export type SpaceStatus = 'available' | 'occupied' | 'unavailable';

export interface ParkingSpace {
  id: string;
  space_label: string;
  space_status: SpaceStatus;
  zone: 'A' | 'B' | 'C' | 'D';
  vehicle_plate?: string;
  occupied_since?: string;
  type?: 'standard' | 'ev' | 'accessible' | 'vip';
}

export interface VehicleMovement {
  id: string;
  registration_number: string;
  entry_at: string;
  exit_at?: string;
  duration_minutes?: number;
  parking_status: 'inside' | 'exited';
  parking_space_id: string | null;
  space_label?: string;
  vehicle_type?: 'Sedan' | 'SUV' | 'EV' | 'Van' | 'Truck';
  fee?: number;
  driver_name?: string;
  notes?: string;
}

export type ActiveTab = 
  | 'Dashboard' 
  | 'Spaces' 
  | 'Movements' 
  | 'Activity' 
  | 'Revenue' 
  | 'Notifications' 
  | 'Staff' 
  | 'Settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
