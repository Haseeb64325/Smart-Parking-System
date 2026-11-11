import { ParkingSpace, VehicleMovement } from '../types';

export const INITIAL_SPACES: ParkingSpace[] = [
  // Zone A (Executive & EV)
  { id: 'space-A1', space_label: 'A1', space_status: 'occupied', zone: 'A', vehicle_plate: 'KJH 482', type: 'vip' },
  { id: 'space-A2', space_label: 'A2', space_status: 'occupied', zone: 'A', vehicle_plate: 'TX-904-L', type: 'vip' },
  { id: 'space-A3', space_label: 'A3', space_status: 'available', zone: 'A', type: 'ev' },
  { id: 'space-A4', space_label: 'A4', space_status: 'occupied', zone: 'A', vehicle_plate: 'NEX-8821', type: 'ev' },
  { id: 'space-A5', space_label: 'A5', space_status: 'available', zone: 'A', type: 'accessible' },
  { id: 'space-A6', space_label: 'A6', space_status: 'unavailable', zone: 'A', type: 'standard' },

  // Zone B (Covered Central)
  { id: 'space-B1', space_label: 'B1', space_status: 'occupied', zone: 'B', vehicle_plate: '7ABC890', type: 'standard' },
  { id: 'space-B2', space_label: 'B2', space_status: 'available', zone: 'B', type: 'standard' },
  { id: 'space-B3', space_label: 'B3', space_status: 'occupied', zone: 'B', vehicle_plate: 'JXQ 2718', type: 'standard' },
  { id: 'space-B4', space_label: 'B4', space_status: 'occupied', zone: 'B', vehicle_plate: '8VXR219', type: 'standard' },
  { id: 'space-B5', space_label: 'B5', space_status: 'occupied', zone: 'B', vehicle_plate: 'WCD 308', type: 'standard' },
  { id: 'space-B6', space_label: 'B6', space_status: 'available', zone: 'B', type: 'standard' },

  // Zone C (Standard South)
  { id: 'space-C1', space_label: 'C1', space_status: 'occupied', zone: 'C', vehicle_plate: 'EL-409-VK', type: 'standard' },
  { id: 'space-C2', space_label: 'C2', space_status: 'occupied', zone: 'C', vehicle_plate: '6TRP451', type: 'standard' },
  { id: 'space-C3', space_label: 'C3', space_status: 'occupied', zone: 'C', vehicle_plate: 'BC-772-ZZ', type: 'standard' },
  { id: 'space-C4', space_label: 'C4', space_status: 'occupied', zone: 'C', vehicle_plate: '9PLM102', type: 'standard' },
  { id: 'space-C5', space_label: 'C5', space_status: 'occupied', zone: 'C', vehicle_plate: 'KV-338-RA', type: 'standard' },
  { id: 'space-C6', space_label: 'C6', space_status: 'available', zone: 'C', type: 'standard' },

  // Zone D (Transit & Delivery)
  { id: 'space-D1', space_label: 'D1', space_status: 'occupied', zone: 'D', vehicle_plate: 'NY-882-GR', type: 'standard' },
  { id: 'space-D2', space_label: 'D2', space_status: 'occupied', zone: 'D', vehicle_plate: '5KND194', type: 'standard' },
  { id: 'space-D3', space_label: 'D3', space_status: 'occupied', zone: 'D', vehicle_plate: 'WA-710-CX', type: 'standard' },
  { id: 'space-D4', space_label: 'D4', space_status: 'occupied', zone: 'D', vehicle_plate: '3MXZ908', type: 'standard' },
  { id: 'space-D5', space_label: 'D5', space_status: 'occupied', zone: 'D', vehicle_plate: 'FL-612-QQ', type: 'standard' },
  { id: 'space-D6', space_label: 'D6', space_status: 'occupied', zone: 'D', vehicle_plate: '4HYT339', type: 'standard' },
];

export const getInitialMovements = (): VehicleMovement[] => {
  const now = new Date();
  const d = (hoursAgo: number, minutesAgo: number = 0) => {
    const time = new Date(now.getTime() - (hoursAgo * 60 + minutesAgo) * 60 * 1000);
    return time.toISOString();
  };

  return [
    {
      id: 'mov-1',
      registration_number: 'KJH 482',
      entry_at: d(0, 48),
      parking_status: 'inside',
      parking_space_id: 'space-A1',
      space_label: 'A1',
      vehicle_type: 'Sedan',
      driver_name: 'Marcus Vance',
      fee: 7.00
    },
    {
      id: 'mov-2',
      registration_number: 'MTR 901',
      entry_at: d(3, 15),
      exit_at: d(0, 52),
      duration_minutes: 143,
      parking_status: 'exited',
      parking_space_id: 'space-A3',
      space_label: 'A3',
      vehicle_type: 'SUV',
      driver_name: 'Elena Rostova',
      fee: 10.50
    },
    {
      id: 'mov-3',
      registration_number: 'JXQ 2718',
      entry_at: d(1, 10),
      parking_status: 'inside',
      parking_space_id: 'space-B3',
      space_label: 'B3',
      vehicle_type: 'EV',
      driver_name: 'Julian Chen',
      fee: 7.00
    },
    {
      id: 'mov-4',
      registration_number: 'LNP 664',
      entry_at: d(3, 40),
      exit_at: d(1, 20),
      duration_minutes: 100,
      parking_status: 'exited',
      parking_space_id: null,
      space_label: 'Drop-off Bay',
      vehicle_type: 'Sedan',
      driver_name: 'Sarah Connor',
      fee: 7.00
    },
    {
      id: 'mov-5',
      registration_number: '8VXR219',
      entry_at: d(1, 40),
      parking_status: 'inside',
      parking_space_id: 'space-B4',
      space_label: 'B4',
      vehicle_type: 'SUV',
      driver_name: 'David Kim',
      fee: 7.00
    },
    {
      id: 'mov-6',
      registration_number: 'WCD 308',
      entry_at: d(1, 55),
      parking_status: 'inside',
      parking_space_id: 'space-B5',
      space_label: 'B5',
      vehicle_type: 'Sedan',
      driver_name: 'Amara Patel',
      fee: 7.00
    },
    {
      id: 'mov-7',
      registration_number: 'TX-904-L',
      entry_at: d(2, 30),
      parking_status: 'inside',
      parking_space_id: 'space-A2',
      space_label: 'A2',
      vehicle_type: 'Sedan',
      driver_name: 'Oliver Queen',
      fee: 10.50
    },
    {
      id: 'mov-8',
      registration_number: 'NEX-8821',
      entry_at: d(2, 15),
      parking_status: 'inside',
      parking_space_id: 'space-A4',
      space_label: 'A4',
      vehicle_type: 'EV',
      driver_name: 'Chloe Decker',
      fee: 10.50
    },
    {
      id: 'mov-9',
      registration_number: '7ABC890',
      entry_at: d(3, 0),
      parking_status: 'inside',
      parking_space_id: 'space-B1',
      space_label: 'B1',
      vehicle_type: 'SUV',
      driver_name: 'Robert Thorne',
      fee: 10.50
    },
    {
      id: 'mov-10',
      registration_number: 'EL-409-VK',
      entry_at: d(3, 20),
      parking_status: 'inside',
      parking_space_id: 'space-C1',
      space_label: 'C1',
      vehicle_type: 'Sedan',
      driver_name: 'Sophie Moreau',
      fee: 14.00
    },
    {
      id: 'mov-11',
      registration_number: '6TRP451',
      entry_at: d(3, 45),
      parking_status: 'inside',
      parking_space_id: 'space-C2',
      space_label: 'C2',
      vehicle_type: 'Van',
      driver_name: 'Lucas Gray',
      fee: 14.00
    },
    {
      id: 'mov-12',
      registration_number: 'BC-772-ZZ',
      entry_at: d(4, 10),
      parking_status: 'inside',
      parking_space_id: 'space-C3',
      space_label: 'C3',
      vehicle_type: 'Sedan',
      driver_name: 'Marco Rossi',
      fee: 14.00
    },
    {
      id: 'mov-13',
      registration_number: '9PLM102',
      entry_at: d(4, 25),
      parking_status: 'inside',
      parking_space_id: 'space-C4',
      space_label: 'C4',
      vehicle_type: 'SUV',
      driver_name: 'Nadia Petrova',
      fee: 17.50
    },
    {
      id: 'mov-14',
      registration_number: 'KV-338-RA',
      entry_at: d(4, 50),
      parking_status: 'inside',
      parking_space_id: 'space-C5',
      space_label: 'C5',
      vehicle_type: 'EV',
      driver_name: 'Jan De Vries',
      fee: 17.50
    },
    {
      id: 'mov-15',
      registration_number: 'NY-882-GR',
      entry_at: d(5, 10),
      parking_status: 'inside',
      parking_space_id: 'space-D1',
      space_label: 'D1',
      vehicle_type: 'Sedan',
      driver_name: 'James Morales',
      fee: 17.50
    },
    {
      id: 'mov-16',
      registration_number: '5KND194',
      entry_at: d(5, 30),
      parking_status: 'inside',
      parking_space_id: 'space-D2',
      space_label: 'D2',
      vehicle_type: 'SUV',
      driver_name: 'Emily Watson',
      fee: 21.00
    },
    {
      id: 'mov-17',
      registration_number: 'WA-710-CX',
      entry_at: d(5, 45),
      parking_status: 'inside',
      parking_space_id: 'space-D3',
      space_label: 'D3',
      vehicle_type: 'Sedan',
      driver_name: 'Brian O’Connor',
      fee: 21.00
    },
    {
      id: 'mov-18',
      registration_number: '3MXZ908',
      entry_at: d(6, 0),
      parking_status: 'inside',
      parking_space_id: 'space-D4',
      space_label: 'D4',
      vehicle_type: 'Truck',
      driver_name: 'Carlos Santana',
      fee: 21.00
    },
    {
      id: 'mov-19',
      registration_number: 'FL-612-QQ',
      entry_at: d(6, 20),
      parking_status: 'inside',
      parking_space_id: 'space-D5',
      space_label: 'D5',
      vehicle_type: 'Sedan',
      driver_name: 'Hannah Abbott',
      fee: 24.50
    },
    {
      id: 'mov-20',
      registration_number: '4HYT339',
      entry_at: d(6, 40),
      parking_status: 'inside',
      parking_space_id: 'space-D6',
      space_label: 'D6',
      vehicle_type: 'SUV',
      driver_name: 'Thomas Wayne',
      fee: 24.50
    },
    {
      id: 'mov-21',
      registration_number: 'PA-551-ZZ',
      entry_at: d(7, 15),
      exit_at: d(5, 40),
      duration_minutes: 95,
      parking_status: 'exited',
      parking_space_id: 'space-B2',
      space_label: 'B2',
      vehicle_type: 'Sedan',
      driver_name: 'Claire Beauchamp',
      fee: 7.00
    },
    {
      id: 'mov-22',
      registration_number: '8KLS992',
      entry_at: d(8, 0),
      exit_at: d(6, 10),
      duration_minutes: 110,
      parking_status: 'exited',
      parking_space_id: 'space-C6',
      space_label: 'C6',
      vehicle_type: 'Sedan',
      driver_name: 'Gareth Bale',
      fee: 7.00
    }
  ];
};

export const HOURLY_RATE = 3.50;
export const DAILY_MAX_RATE = 28.00;

export function calculateFee(entryAt: string, exitAt?: string): number {
  const start = new Date(entryAt).getTime();
  const end = exitAt ? new Date(exitAt).getTime() : Date.now();
  const hours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
  const cost = hours * HOURLY_RATE;
  return Math.min(cost, DAILY_MAX_RATE);
}

export function formatDuration(minutes: number): string {
  if (minutes < 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}
