import { useState } from 'react';
import { WorkshopPlanningInterface } from '@/components/planning/WorkshopPlanningInterface';
import { useEmployees } from '@/hooks/use-employees';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  client: string;
  price: string;
  duration: string;
  description: string;
  technician?: string;
  status: 'En cours' | 'À planifier' | 'Terminé';
}

interface Schedule {
  id: string;
  employee_id: string;
  vehicle_id: string;
  start_time: string;
  end_time: string;
}

// Mock data for demonstration
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Peugeot',
    model: '308',
    licensePlate: 'AB-123-CD',
    client: 'Jean Dupont',
    price: '1200€',
    duration: '3h30',
    description: 'Réparation pare-chocs avant',
    technician: 'Marc Martin',
    status: 'En cours'
  },
  {
    id: '2',
    brand: 'Renault',
    model: 'Clio',
    licensePlate: 'EF-456-GH',
    client: 'Marie Durant',
    price: '800€',
    duration: '2h00',
    description: 'Peinture portière droite',
    status: 'À planifier'
  },
  {
    id: '3',
    brand: 'Citroën',
    model: 'C3',
    licensePlate: 'IJ-789-KL',
    client: 'Pierre Moreau',
    price: '1500€',
    duration: '4h00',
    description: 'Remplacement capot',
    technician: 'Julie Blanc',
    status: 'Terminé'
  }
];

const mockSchedules: Schedule[] = [
  {
    id: '1',
    employee_id: '1',
    vehicle_id: '1',
    start_time: '2024-01-15T08:00:00',
    end_time: '2024-01-15T11:30:00'
  }
];

export default function KarrosseriePlanningPage() {
  const { employees } = useEmployees();
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);

  const handleScheduleUpdate = async (updatedSchedules: Schedule[]) => {
    setSchedules(updatedSchedules);
    // Here you could also update the database if needed
  };

  return (
    <div className="container mx-auto p-6">
      <WorkshopPlanningInterface
        employees={employees || []}
        vehicles={vehicles}
        schedules={schedules}
        onScheduleUpdate={handleScheduleUpdate}
      />
    </div>
  );
}